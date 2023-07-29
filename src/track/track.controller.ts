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
import { TrackService } from './track.service';
import { PARSE_UUID_PIPE_OPTIONS } from 'src/constants';
import { CreateTrackDto, UpdateTrackDto } from './dto';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string) {
    return this.trackService.findOne(id);
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOne(
    @Param('id', new ParseUUIDPipe(PARSE_UUID_PIPE_OPTIONS)) id: string,
  ) {
    return this.trackService.deleteOne(id);
  }
}
