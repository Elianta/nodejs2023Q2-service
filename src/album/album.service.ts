import { Injectable, NotFoundException } from '@nestjs/common';
import { ERR_MESSAGES } from 'src/constants';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findMany(ids: string[]) {
    return await this.prisma.album.findMany({
      where: { id: { in: ids } },
    });
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (album === null) {
      throw new NotFoundException(ERR_MESSAGES.ALBUM_NOT_FOUND);
    }

    return album;
  }

  async create(dto: CreateAlbumDto) {
    const album = await this.prisma.album.create({
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId,
      },
    });

    return album;
  }

  async update(id: string, dto: UpdateAlbumDto) {
    try {
      const updatedAlbum = await this.prisma.album.update({
        where: { id },
        data: dto,
      });
      return updatedAlbum;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(ERR_MESSAGES.ALBUM_NOT_FOUND);
        }
      }
      throw error;
    }
  }

  async deleteOne(id: string) {
    try {
      const deletedAlbum = await this.prisma.album.delete({
        where: { id },
      });
      return deletedAlbum.id;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(ERR_MESSAGES.ALBUM_NOT_FOUND);
        }
      }
      throw error;
    }

    //TODO:
    // try {
    //   this.db.deleteFromFavorites(FavoritesType.ALBUM, id);
    // } catch {}
  }
}
