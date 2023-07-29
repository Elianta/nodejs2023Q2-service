import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  SafeUser,
  Track,
  Artist,
  Album,
  Favorites,
  FavoritesType,
} from 'src/types';
import { ERR_MESSAGES } from 'src/constants';

@Injectable()
export class DbService {
  private users: User[] = [];
  private tracks: Track[] = [];
  private artists: Artist[] = [];
  private albums: Album[] = [];
  private favorites: Favorites = {
    albums: [],
    artists: [],
    tracks: [],
  };

  private _getSafeUser(user: User): SafeUser {
    const { passwordHash: _, ...safeUser } = user;

    return safeUser;
  }

  getAllUsers() {
    return this.users.map((user) => this._getSafeUser(user));
  }

  getOneUser(id: string, safe = true): User | SafeUser | null {
    const found = this.users.find((user) => user.id === id);

    if (!found) return null;
    if (safe) return this._getSafeUser(found);
    return found;
  }

  deleteOneUser(id: string) {
    const prevLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    const currentLength = this.users.length;

    return currentLength < prevLength ? id : null;
  }

  createUser({
    data: { login, hash },
  }: {
    data: { login: string; hash: string };
  }): SafeUser {
    const createdAt = Date.now();
    const user: User = {
      id: uuidv4(),
      login,
      passwordHash: hash,
      version: 1,
      createdAt,
      updatedAt: createdAt,
    };

    this.users.push(user);

    return this._getSafeUser(user);
  }

  updateUser({
    data: { id, userData },
  }: {
    data: { id: string; userData: Partial<User> };
  }) {
    const found = this.users.find((user) => user.id === id);

    if (!found) return null;

    for (const key in userData) {
      found[key] = userData[key];
    }
    found.version = found.version + 1;
    found.updatedAt = Date.now();

    return this._getSafeUser(found);
  }

  getAllTracks() {
    return this.tracks;
  }

  getManyTracks(ids: string[]) {
    return this.tracks.filter((track) => ids.includes(track.id));
  }

  getOneTrack(id: string): Track | null {
    const found = this.tracks.find((track) => track.id === id);

    if (!found) return null;
    return found;
  }

  createTrack({
    data: { name, duration, albumId, artistId },
  }: {
    data: {
      name: string;
      duration: number;
      albumId?: string;
      artistId?: string;
    };
  }): Track {
    const track: Track = {
      id: uuidv4(),
      name,
      duration,
      albumId: albumId ?? null,
      artistId: artistId ?? null,
    };

    this.tracks.push(track);

    return track;
  }

  updateTrack({
    data: { id, trackData },
  }: {
    data: { id: string; trackData: Partial<Track> };
  }) {
    const found = this.tracks.find((track) => track.id === id);

    if (!found) return null;

    for (const key in trackData) {
      found[key] = trackData[key];
    }

    return found;
  }

  deleteOneTrack(id: string) {
    const prevLength = this.tracks.length;
    this.tracks = this.tracks.filter((track) => track.id !== id);
    const currentLength = this.tracks.length;

    return currentLength < prevLength ? id : null;
  }

  getAllArtists() {
    return this.artists;
  }

  getManyArtists(ids: string[]) {
    return this.artists.filter((artist) => ids.includes(artist.id));
  }

  getOneArtist(id: string): Artist | null {
    const found = this.artists.find((artist) => artist.id === id);

    if (!found) return null;
    return found;
  }

  createArtist({
    data: { name, grammy },
  }: {
    data: { name: string; grammy: boolean };
  }): Artist {
    const artist: Artist = {
      id: uuidv4(),
      name,
      grammy,
    };

    this.artists.push(artist);

    return artist;
  }

  updateArtist({
    data: { id, artistData },
  }: {
    data: { id: string; artistData: Partial<Artist> };
  }) {
    const found = this.artists.find((artist) => artist.id === id);

    if (!found) return null;

    for (const key in artistData) {
      found[key] = artistData[key];
    }

    return found;
  }

  deleteOneArtist(id: string) {
    const prevLength = this.artists.length;
    this.artists = this.artists.filter((artist) => artist.id !== id);
    const currentLength = this.artists.length;

    return currentLength < prevLength ? id : null;
  }

  getAllAlbums() {
    return this.albums;
  }

  getManyAlbums(ids: string[]) {
    return this.albums.filter((album) => ids.includes(album.id));
  }

  getOneAlbum(id: string): Album | null {
    const found = this.albums.find((album) => album.id === id);

    if (!found) return null;
    return found;
  }

  createAlbum({
    data: { name, year, artistId },
  }: {
    data: { name: string; year: number; artistId?: string | null };
  }): Album {
    const album: Album = {
      id: uuidv4(),
      name,
      year,
      artistId: artistId ?? null,
    };

    this.albums.push(album);

    return album;
  }

  updateAlbum({
    data: { id, albumData },
  }: {
    data: { id: string; albumData: Partial<Album> };
  }) {
    const found = this.albums.find((album) => album.id === id);

    if (!found) return null;

    for (const key in albumData) {
      found[key] = albumData[key];
    }

    return found;
  }

  deleteOneAlbum(id: string) {
    const prevLength = this.albums.length;
    this.albums = this.albums.filter((album) => album.id !== id);
    const currentLength = this.albums.length;

    return currentLength < prevLength ? id : null;
  }

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
