import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../user-management/auth/guards/cookie-token.guard';
import { Roles } from '../user-management/auth/decorators/roles.decorator';
import { RolesGuard } from '../user-management/auth/guards/roles.guard';
import { CompanyInfoService } from './company-info.service';

@Controller('companyInfo')
export class CompanyInfoController {
  constructor(private readonly companyInfo: CompanyInfoService) {}

  @Get()
  getCompanyInfo() {
    return this.companyInfo.findAll();
  }

  @Post()
  createCompanyInfo() {
    return this.companyInfo.create();
  }

  @Get(':id')
  getCompanyInfoById(@Param('id') id: string) {
    return this.companyInfo.findById(id);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('employee')
  updateCompanyInfo(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.companyInfo.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('employee')
  deleteCompanyInfo(@Param('id') id: string) {
    return this.companyInfo.delete(id);
  }
}
