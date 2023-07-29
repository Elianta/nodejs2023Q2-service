import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';

@Module({
  imports: [UserModule, DbModule, TrackModule, ArtistModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
