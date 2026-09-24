import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [GoogleController],
  providers: [GoogleService],
})
export class GoogleModule {}
