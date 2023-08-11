import { Injectable, NotFoundException } from '@nestjs/common';
import { ERR_MESSAGES } from 'src/constants';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AlbumEntity } from './entity/album.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return plainToInstance(AlbumEntity, await this.prisma.album.findMany());
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (album === null) {
      throw new NotFoundException(ERR_MESSAGES.ALBUM_NOT_FOUND);
    }

    return plainToInstance(AlbumEntity, album);
  }

  async create(dto: CreateAlbumDto) {
    const album = await this.prisma.album.create({
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId,
      },
    });

    return plainToInstance(AlbumEntity, album);
  }

  async update(id: string, dto: UpdateAlbumDto) {
    try {
      const updatedAlbum = await this.prisma.album.update({
        where: { id },
        data: dto,
      });
      return plainToInstance(AlbumEntity, updatedAlbum);
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
  }
}
