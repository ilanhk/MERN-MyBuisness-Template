import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../user-management/auth/guards/cookie-token.guard';
import { Roles } from '../user-management/auth/decorators/roles.decorator';
import { RolesGuard } from '../user-management/auth/guards/roles.guard';
import { WebsiteStylesService } from './website-styles.service';

@Controller('website-styles')
export class WebsiteStylesController {
  constructor(private readonly styles: WebsiteStylesService) {}

  @Get()
  getStyles() { return this.styles.findAll(); }

  @Post()
  createStyles() { return this.styles.create(); }

  @Get(':id')
  getStylesById(@Param('id') id: string) { return this.styles.findById(id); }

  @Put(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('employee')
  updateStyles(@Param('id') id: string, @Body() body: Record<string, unknown>) { return this.styles.update(id, body); }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('employee')
  deleteStyles(@Param('id') id: string) { return this.styles.delete(id); }
}
