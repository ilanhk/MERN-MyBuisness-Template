import { Module } from '@nestjs/common';
import { CompanyInfoHistoryService } from './company-info-history.service';
import { CompanyInfoHistoryController } from './company-info-history.controller';

@Module({
  controllers: [CompanyInfoHistoryController],
  providers: [CompanyInfoHistoryService],
})
export class CompanyInfoHistoryModule {}
