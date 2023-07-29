import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [UserModule, DbModule, TrackModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
