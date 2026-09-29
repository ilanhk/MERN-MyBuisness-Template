import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupplierOrdersService } from './supplier-orders.service';
import { CreateSupplierOrderDto } from './dto/create-supplier-order.dto';
import { UpdateSupplierOrderDto } from './dto/update-supplier-order.dto';

@Controller('supplier-orders')
export class SupplierOrdersController {
  constructor(private readonly supplierOrdersService: SupplierOrdersService) {}

  @Post()
  create(@Body() createSupplierOrderDto: CreateSupplierOrderDto) {
    return this.supplierOrdersService.create(createSupplierOrderDto);
  }

  @Get()
  findAll() {
    return this.supplierOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplierOrderDto: UpdateSupplierOrderDto) {
    return this.supplierOrdersService.update(+id, updateSupplierOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierOrdersService.remove(+id);
  }
}
