import { Module } from '@nestjs/common';
import { UsersModule } from '../user-management/users/users.module';
import { CompanyInfoController } from './company-info.controller';
import { CompanyInfoService } from './company-info.service';

@Module({
  imports: [UsersModule],
  controllers: [CompanyInfoController],
  providers: [CompanyInfoService],
})
export class CompanyInfoModule {}
