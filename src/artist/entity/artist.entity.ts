import { Exclude } from 'class-transformer';
import { Artist } from '@prisma/client';

export class ArtistEntity implements Artist {
  id: string;

  name: string;

  grammy: boolean;

  @Exclude()
  inFavorites: boolean;
}
