import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ERR_MESSAGES } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackEntity } from 'src/track/entity/track.entity';
import { AlbumEntity } from 'src/album/entity/album.entity';
import { ArtistEntity } from 'src/artist/entity/artist.entity';
import { plainToInstance } from 'class-transformer';
import { handleNotFoundError } from 'src/utils';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const tracks = await this.prisma.track.findMany({
      where: { inFavorites: true },
    });
    const artists = await this.prisma.artist.findMany({
      where: { inFavorites: true },
    });
    const albums = await this.prisma.album.findMany({
      where: { inFavorites: true },
    });

    return {
      tracks: plainToInstance(TrackEntity, tracks),
      albums: plainToInstance(AlbumEntity, albums),
      artists: plainToInstance(ArtistEntity, artists),
    };
  }

  async addTrack(id: string) {
    try {
      await this.prisma.track.update({
        where: { id },
        data: { inFavorites: true },
      });
    } catch (error) {
      handleNotFoundError(
        error,
        ERR_MESSAGES.TRACK_NOT_FOUND,
        UnprocessableEntityException,
      );
      throw error;
    }
  }

  async deleteTrack(id: string) {
    try {
      await this.prisma.track.update({
        where: { id },
        data: { inFavorites: false },
      });
    } catch (error) {
      handleNotFoundError(error, ERR_MESSAGES.TRACK_NOT_FOUND);
      throw error;
    }
  }

  async addAlbum(id: string) {
    try {
      await this.prisma.album.update({
        where: { id },
        data: { inFavorites: true },
      });
    } catch (error) {
      handleNotFoundError(
        error,
        ERR_MESSAGES.ALBUM_NOT_FOUND,
        UnprocessableEntityException,
      );
      throw error;
    }
  }

  async deleteAlbum(id: string) {
    try {
      await this.prisma.album.update({
        where: { id },
        data: { inFavorites: false },
      });
    } catch (error) {
      handleNotFoundError(error, ERR_MESSAGES.ALBUM_NOT_FOUND);
      throw error;
    }
  }

  async addArtist(id: string) {
    try {
      await this.prisma.artist.update({
        where: { id },
        data: { inFavorites: true },
      });
    } catch (error) {
      handleNotFoundError(
        error,
        ERR_MESSAGES.ARTIST_NOT_FOUND,
        UnprocessableEntityException,
      );
      throw error;
    }
  }

  async deleteArtist(id: string) {
    try {
      await this.prisma.artist.update({
        where: { id },
        data: { inFavorites: false },
      });
    } catch (error) {
      handleNotFoundError(error, ERR_MESSAGES.ARTIST_NOT_FOUND);
      throw error;
    }
  }
}
