import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { ERR_MESSAGES } from 'src/constants';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Injectable()
export class AlbumService {
  constructor(private db: DbService) {}

  findAll() {
    return this.db.getAllAlbums();
  }

  findOne(id: string) {
    const album = this.db.getOneAlbum(id);
    if (album === null) {
      throw new NotFoundException(ERR_MESSAGES.ALBUM_NOT_FOUND);
    }

    return album;
  }

  create(dto: CreateAlbumDto) {
    const album = this.db.createAlbum({
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId,
      },
    });

    return album;
  }

  update(id: string, dto: UpdateAlbumDto) {
    const updatedAlbum = this.db.updateAlbum({
      data: {
        id,
        albumData: dto,
      },
    });
    if (updatedAlbum === null) {
      throw new NotFoundException(ERR_MESSAGES.ALBUM_NOT_FOUND);
    }

    return updatedAlbum;
  }

  deleteOne(id: string) {
    const deletedId = this.db.deleteOneAlbum(id);
    if (deletedId === null) {
      throw new NotFoundException(ERR_MESSAGES.ALBUM_NOT_FOUND);
    }
  }
}
