import { Injectable, NotFoundException } from '@nestjs/common';
import { ERR_MESSAGES } from 'src/constants';
import { CreateArtistDto, UpdateArtistDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findMany(ids: string[]) {
    return await this.prisma.artist.findMany({
      where: { id: { in: ids } },
    });
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (artist === null) {
      throw new NotFoundException(ERR_MESSAGES.ARTIST_NOT_FOUND);
    }

    return artist;
  }

  async create(dto: CreateArtistDto) {
    const artist = await this.prisma.artist.create({
      data: {
        name: dto.name,
        grammy: dto.grammy,
      },
    });

    return artist;
  }

  async update(id: string, dto: UpdateArtistDto) {
    try {
      const updatedArtist = await this.prisma.artist.update({
        where: { id },
        data: dto,
      });
      return updatedArtist;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(ERR_MESSAGES.ARTIST_NOT_FOUND);
        }
      }
      throw error;
    }
  }

  async deleteOne(id: string) {
    try {
      const deletedArtist = await this.prisma.artist.delete({ where: { id } });
      return deletedArtist.id;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(ERR_MESSAGES.ARTIST_NOT_FOUND);
        }
      }
      throw error;
    }

    //TODO:
    // try {
    //   this.db.deleteFromFavorites(FavoritesType.ARTIST, id);
    // } catch {}
  }
}
