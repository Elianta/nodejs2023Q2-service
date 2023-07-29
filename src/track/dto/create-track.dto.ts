import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  artistId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  albumId: string;
}
