export interface User {
  id: string;
  login: string;
  passwordHash: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export type SafeUser = Omit<User, 'passwordHash'>;

export interface Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}
