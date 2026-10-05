import { Injectable } from '@nestjs/common';
import { CreateSubscriptionInvoiceDto } from './dto/create-subscription-invoice.dto';
import { UpdateSubscriptionInvoiceDto } from './dto/update-subscription-invoice.dto';

@Injectable()
export class SubscriptionInvoicesService {
  create(createSubscriptionInvoiceDto: CreateSubscriptionInvoiceDto) {
    return 'This action adds a new subscriptionInvoice';
  }

  findAll() {
    return `This action returns all subscriptionInvoices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionInvoice`;
  }

  update(id: number, updateSubscriptionInvoiceDto: UpdateSubscriptionInvoiceDto) {
    return `This action updates a #${id} subscriptionInvoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionInvoice`;
  }
}
