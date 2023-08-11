import { Injectable, NotFoundException } from '@nestjs/common';
import { ERR_MESSAGES } from 'src/constants';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findMany(ids: string[]) {
    return await this.prisma.track.findMany({
      where: { id: { in: ids } },
    });
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    if (track === null) {
      throw new NotFoundException(ERR_MESSAGES.TRACK_NOT_FOUND);
    }

    return track;
  }

  async create(dto: CreateTrackDto) {
    const track = await this.prisma.track.create({
      data: {
        name: dto.name,
        duration: dto.duration,
        albumId: dto.albumId,
        artistId: dto.artistId,
      },
    });

    return track;
  }

  async update(id: string, dto: UpdateTrackDto) {
    try {
      const updatedTrack = await this.prisma.track.update({
        where: { id },
        data: dto,
      });
      return updatedTrack;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(ERR_MESSAGES.TRACK_NOT_FOUND);
        }
      }
      throw error;
    }
  }

  async deleteOne(id: string) {
    try {
      const deletedTrack = await this.prisma.track.delete({ where: { id } });
      return deletedTrack.id;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(ERR_MESSAGES.TRACK_NOT_FOUND);
        }
      }
      throw error;
    }

    // try {
    //   // TODO: rewrite
    //   this.db.deleteFromFavorites(FavoritesType.TRACK, id);
    // } catch {}
  }
}
