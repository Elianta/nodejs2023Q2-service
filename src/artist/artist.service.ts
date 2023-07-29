import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { ERR_MESSAGES } from 'src/constants';
import { CreateArtistDto, UpdateArtistDto } from './dto';
import { FavoritesType } from 'src/types';

@Injectable()
export class ArtistService {
  constructor(private db: DbService) {}

  findAll() {
    return this.db.getAllArtists();
  }

  findMany(ids: string[]) {
    return this.db.getManyArtists(ids);
  }

  findOne(id: string) {
    const artist = this.db.getOneArtist(id);
    if (artist === null) {
      throw new NotFoundException(ERR_MESSAGES.ARTIST_NOT_FOUND);
    }

    return artist;
  }

  create(dto: CreateArtistDto) {
    const artist = this.db.createArtist({
      data: {
        name: dto.name,
        grammy: dto.grammy,
      },
    });

    return artist;
  }

  update(id: string, dto: UpdateArtistDto) {
    const updatedArtist = this.db.updateArtist({
      data: {
        id,
        artistData: dto,
      },
    });
    if (updatedArtist === null) {
      throw new NotFoundException(ERR_MESSAGES.ARTIST_NOT_FOUND);
    }

    return updatedArtist;
  }

  deleteOne(id: string) {
    const deletedId = this.db.deleteOneArtist(id);
    if (deletedId === null) {
      throw new NotFoundException(ERR_MESSAGES.ARTIST_NOT_FOUND);
    }

    this.db.deleteArtistIdFromTracks(id);

    try {
      this.db.deleteFromFavorites(FavoritesType.ARTIST, id);
    } catch {}
  }
}
