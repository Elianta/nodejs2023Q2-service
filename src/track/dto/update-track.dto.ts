import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
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
