import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriptionInvoicesService } from './subscription-invoices.service';
import { CreateSubscriptionInvoiceDto } from './dto/create-subscription-invoice.dto';
import { UpdateSubscriptionInvoiceDto } from './dto/update-subscription-invoice.dto';

@Controller('subscription-invoices')
export class SubscriptionInvoicesController {
  constructor(private readonly subscriptionInvoicesService: SubscriptionInvoicesService) {}

  @Post()
  create(@Body() createSubscriptionInvoiceDto: CreateSubscriptionInvoiceDto) {
    return this.subscriptionInvoicesService.create(createSubscriptionInvoiceDto);
  }

  @Get()
  findAll() {
    return this.subscriptionInvoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionInvoicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionInvoiceDto: UpdateSubscriptionInvoiceDto) {
    return this.subscriptionInvoicesService.update(+id, updateSubscriptionInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionInvoicesService.remove(+id);
  }
}
