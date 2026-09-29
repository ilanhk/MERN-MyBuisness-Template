import { Module } from '@nestjs/common';
import { WebsiteStylesHistoryService } from './website-styles-history.service';
import { WebsiteStylesHistoryController } from './website-styles-history.controller';

@Module({
  controllers: [WebsiteStylesHistoryController],
  providers: [WebsiteStylesHistoryService],
})
export class WebsiteStylesHistoryModule {}
