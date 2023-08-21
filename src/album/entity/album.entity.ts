import { Exclude } from 'class-transformer';
import { Album } from '@prisma/client';

export class AlbumEntity implements Album {
  id: string;

  name: string;

  year: number;

  artistId: string | null;

  @Exclude()
  inFavorites: boolean;
}
