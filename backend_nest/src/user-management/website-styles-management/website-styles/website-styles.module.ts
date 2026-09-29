import { Module } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { WebsiteStylesController } from './website-styles.controller';
import { WebsiteStylesService } from './website-styles.service';

@Module({
  imports: [UsersModule],
  controllers: [WebsiteStylesController],
  providers: [WebsiteStylesService],
})
export class WebsiteStylesModule {}
