import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../user-management/auth/guards/cookie-token.guard';
import { Roles } from '../user-management/auth/decorators/roles.decorator';
import { RolesGuard } from '../user-management/auth/guards/roles.guard';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Get()
  getServices() {
    return this.services.findAll();
  }

  @Get(':id')
  getService(@Param('id') id: string) {
    return this.services.findById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  createService(@Body() body: Record<string, unknown>) {
    return this.services.create(body);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  updateService(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.services.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  deleteService(@Param('id') id: string) {
    return this.services.delete(id);
  }
}
