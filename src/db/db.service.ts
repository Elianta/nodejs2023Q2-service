import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User, SafeUser, Track, Artist } from 'src/types';

@Injectable()
export class DbService {
  private users: User[] = [];
  private tracks: Track[] = [];
  private artists: Artist[] = [];

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

  getOneTrack(id: string): Track | null {
    const found = this.tracks.find((track) => track.id === id);

    if (!found) return null;
    return found;
  }

  createTrack({
    data: { name, duration },
  }: {
    data: { name: string; duration: number };
  }): Track {
    const track: Track = {
      id: uuidv4(),
      name,
      duration,
      albumId: null,
      artistId: null,
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
}
