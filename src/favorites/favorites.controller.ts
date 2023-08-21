import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { PARSE_UUID_PIPE_OPTIONS } from 'src/constants';

@Controller('favs')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  addTrack(
    @Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string,
  ) {
    return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(
    @Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string,
  ) {
    return this.favoritesService.deleteTrack(id);
  }

  @Post('album/:id')
  addAlbum(
    @Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string,
  ) {
    return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(
    @Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string,
  ) {
    return this.favoritesService.deleteAlbum(id);
  }

  @Post('artist/:id')
  addArtist(
    @Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string,
  ) {
    return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(
    @Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string,
  ) {
    return this.favoritesService.deleteArtist(id);
  }
}
