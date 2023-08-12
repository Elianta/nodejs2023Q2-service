import { Injectable, NotFoundException } from '@nestjs/common';
import { ERR_MESSAGES } from 'src/constants';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackEntity } from './entity/track.entity';
import { plainToInstance } from 'class-transformer';
import { handleNotFoundError } from 'src/utils';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return plainToInstance(TrackEntity, await this.prisma.track.findMany());
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    if (track === null) {
      throw new NotFoundException(ERR_MESSAGES.TRACK_NOT_FOUND);
    }

    return plainToInstance(TrackEntity, track);
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

    return plainToInstance(TrackEntity, track);
  }

  async update(id: string, dto: UpdateTrackDto) {
    try {
      const updatedTrack = await this.prisma.track.update({
        where: { id },
        data: dto,
      });
      return plainToInstance(TrackEntity, updatedTrack);
    } catch (error) {
      handleNotFoundError(error, ERR_MESSAGES.TRACK_NOT_FOUND);
      throw error;
    }
  }

  async deleteOne(id: string) {
    try {
      const deletedTrack = await this.prisma.track.delete({ where: { id } });
      return deletedTrack.id;
    } catch (error) {
      handleNotFoundError(error, ERR_MESSAGES.TRACK_NOT_FOUND);
      throw error;
    }
  }
}
