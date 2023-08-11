import { Exclude } from 'class-transformer';
import { Track } from '@prisma/client';

export class TrackEntity implements Track {
  id: string;

  name: string;

  duration: number;

  artistId: string | null;

  albumId: string | null;

  @Exclude()
  inFavorites: boolean;
}
