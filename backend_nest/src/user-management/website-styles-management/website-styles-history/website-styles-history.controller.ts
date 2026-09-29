import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WebsiteStylesHistoryService } from './website-styles-history.service';
import { CreateWebsiteStylesHistoryDto } from './dto/create-website-styles-history.dto';
import { UpdateWebsiteStylesHistoryDto } from './dto/update-website-styles-history.dto';

@Controller('website-styles-history')
export class WebsiteStylesHistoryController {
  constructor(private readonly websiteStylesHistoryService: WebsiteStylesHistoryService) {}

  @Post()
  create(@Body() createWebsiteStylesHistoryDto: CreateWebsiteStylesHistoryDto) {
    return this.websiteStylesHistoryService.create(createWebsiteStylesHistoryDto);
  }

  @Get()
  findAll() {
    return this.websiteStylesHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.websiteStylesHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWebsiteStylesHistoryDto: UpdateWebsiteStylesHistoryDto) {
    return this.websiteStylesHistoryService.update(+id, updateWebsiteStylesHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.websiteStylesHistoryService.remove(+id);
  }
}
