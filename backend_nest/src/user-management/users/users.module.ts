import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccessTokenGuard, RefreshTokenGuard } from '../auth/guards/cookie-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AccessTokenGuard, RefreshTokenGuard, RolesGuard],
  exports: [UsersService, AccessTokenGuard, RefreshTokenGuard, RolesGuard],
})
export class UsersModule {}
