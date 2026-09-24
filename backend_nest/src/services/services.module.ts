import { Module } from '@nestjs/common';
import { UsersModule } from '../user-management/users/users.module';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [UsersModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
