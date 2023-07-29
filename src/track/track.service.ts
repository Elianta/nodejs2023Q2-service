import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { ERR_MESSAGES } from 'src/constants';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { FavoritesType } from 'src/types';

@Injectable()
export class TrackService {
  constructor(private db: DbService) {}

  findAll() {
    return this.db.getAllTracks();
  }

  findMany(ids: string[]) {
    return this.db.getManyTracks(ids);
  }

  findOne(id: string) {
    const track = this.db.getOneTrack(id);
    if (track === null) {
      throw new NotFoundException(ERR_MESSAGES.TRACK_NOT_FOUND);
    }

    return track;
  }

  create(dto: CreateTrackDto) {
    const track = this.db.createTrack({
      data: {
        name: dto.name,
        duration: dto.duration,
      },
    });

    return track;
  }

  update(id: string, dto: UpdateTrackDto) {
    const updatedTrack = this.db.updateTrack({
      data: {
        id,
        trackData: dto,
      },
    });
    if (updatedTrack === null) {
      throw new NotFoundException(ERR_MESSAGES.TRACK_NOT_FOUND);
    }

    return updatedTrack;
  }

  deleteOne(id: string) {
    const deletedId = this.db.deleteOneTrack(id);
    if (deletedId === null) {
      throw new NotFoundException(ERR_MESSAGES.TRACK_NOT_FOUND);
    }

    try {
      this.db.deleteFromFavorites(FavoritesType.TRACK, id);
    } catch {}
  }
}
