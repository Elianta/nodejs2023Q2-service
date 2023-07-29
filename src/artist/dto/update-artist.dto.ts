import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateArtistDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsBoolean()
  @IsOptional()
  grammy: boolean;
}
