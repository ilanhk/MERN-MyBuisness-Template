import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyInfoHistoryService } from './company-info-history.service';
import { CreateCompanyInfoHistoryDto } from './dto/create-company-info-history.dto';
import { UpdateCompanyInfoHistoryDto } from './dto/update-company-info-history.dto';

@Controller('company-info-history')
export class CompanyInfoHistoryController {
  constructor(private readonly companyInfoHistoryService: CompanyInfoHistoryService) {}

  @Post()
  create(@Body() createCompanyInfoHistoryDto: CreateCompanyInfoHistoryDto) {
    return this.companyInfoHistoryService.create(createCompanyInfoHistoryDto);
  }

  @Get()
  findAll() {
    return this.companyInfoHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyInfoHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyInfoHistoryDto: UpdateCompanyInfoHistoryDto) {
    return this.companyInfoHistoryService.update(+id, updateCompanyInfoHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyInfoHistoryService.remove(+id);
  }
}
