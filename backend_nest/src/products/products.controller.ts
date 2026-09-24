import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../user-management/auth/guards/cookie-token.guard';
import { Roles } from '../user-management/auth/decorators/roles.decorator';
import { RolesGuard } from '../user-management/auth/guards/roles.guard';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  getProducts(@Query('pageNumber') pageNumber?: string, @Query('keyword') keyword = '') {
    const page = Math.max(Number(pageNumber) || 1, 1);
    return this.products.findAll(page, keyword);
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.products.findById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('employee')
  createProduct() {
    return this.products.create();
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('employee')
  updateProduct(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.products.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('employee')
  deleteProduct(@Param('id') id: string) {
    return this.products.delete(id);
  }
}
