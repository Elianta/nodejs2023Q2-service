import { Injectable } from '@nestjs/common';
import { Favorites, FavoritesType } from 'src/types';
import { ERR_MESSAGES } from 'src/constants';

@Injectable()
export class DbService {
  private favorites: Favorites = {
    albums: [],
    artists: [],
    tracks: [],
  };

  getAllFavorites() {
    return this.favorites;
  }

  addToFavorites(type: FavoritesType, id: string) {
    switch (type) {
      case FavoritesType.ALBUM:
        if (!this.favorites.albums.some((albumId) => albumId === id)) {
          this.favorites.albums.push(id);
        }
        break;
      case FavoritesType.ARTIST:
        if (!this.favorites.artists.some((artistId) => artistId === id)) {
          this.favorites.artists.push(id);
        }
        break;
      case FavoritesType.TRACK:
        if (!this.favorites.tracks.some((trackId) => trackId === id)) {
          this.favorites.tracks.push(id);
        }
        break;
      default:
        break;
    }
  }

  deleteFromFavorites(type: FavoritesType, id: string) {
    switch (type) {
      case FavoritesType.ALBUM:
        if (!this.favorites.albums.some((albumId) => albumId === id)) {
          throw new Error(ERR_MESSAGES.ALBUM_NOT_FOUND);
        }
        this.favorites.albums = this.favorites.albums.filter(
          (albumId) => albumId !== id,
        );
        break;
      case FavoritesType.ARTIST:
        if (!this.favorites.artists.some((artistId) => artistId === id)) {
          throw new Error(ERR_MESSAGES.ARTIST_NOT_FOUND);
        }
        this.favorites.artists = this.favorites.artists.filter(
          (artistId) => artistId !== id,
        );
        break;
      case FavoritesType.TRACK:
        if (!this.favorites.tracks.some((trackId) => trackId === id)) {
          throw new Error(ERR_MESSAGES.TRACK_NOT_FOUND);
        }
        this.favorites.tracks = this.favorites.tracks.filter(
          (trackId) => trackId !== id,
        );
        break;
      default:
        break;
    }
  }
}
