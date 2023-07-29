import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { PARSE_UUID_PIPE_OPTIONS } from 'src/constants';
import { CreateArtistDto, UpdateArtistDto } from './dto';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string) {
    return this.artistService.findOne(id);
  }

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(
    @Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string,
  ) {
    return this.artistService.deleteOne(id);
  }
}
