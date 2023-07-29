import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { ERR_MESSAGES } from 'src/constants';
import { DbService } from 'src/db/db.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesResponse, FavoritesType } from 'src/types';

@Injectable()
export class FavoritesService {
  constructor(
    private db: DbService,
    private trackService: TrackService,
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  findAll(): FavoritesResponse {
    const favorites = this.db.getAllFavorites();
    const trackIds = favorites.tracks;
    const albumIds = favorites.albums;
    const artistIds = favorites.artists;

    const tracks = this.trackService.findMany(trackIds);
    const albums = this.albumService.findMany(albumIds);
    const artists = this.artistService.findMany(artistIds);

    return {
      tracks,
      albums,
      artists,
    };
  }

  addTrack(id: string) {
    try {
      this.trackService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(ERR_MESSAGES.TRACK_NOT_FOUND);
    }

    this.db.addToFavorites(FavoritesType.TRACK, id);
  }

  deleteTrack(id: string) {
    try {
      this.db.deleteFromFavorites(FavoritesType.TRACK, id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  addAlbum(id: string) {
    try {
      this.albumService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(ERR_MESSAGES.ALBUM_NOT_FOUND);
    }

    this.db.addToFavorites(FavoritesType.ALBUM, id);
  }

  deleteAlbum(id: string) {
    try {
      this.db.deleteFromFavorites(FavoritesType.ALBUM, id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  addArtist(id: string) {
    try {
      this.artistService.findOne(id);
    } catch {
      throw new UnprocessableEntityException(ERR_MESSAGES.ARTIST_NOT_FOUND);
    }

    this.db.addToFavorites(FavoritesType.ARTIST, id);
  }

  deleteArtist(id: string) {
    try {
      this.db.deleteFromFavorites(FavoritesType.ARTIST, id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
