import { Module } from '@nestjs/common';
import { SubscriptionInvoicesService } from './subscription-invoices.service';
import { SubscriptionInvoicesController } from './subscription-invoices.controller';

@Module({
  controllers: [SubscriptionInvoicesController],
  providers: [SubscriptionInvoicesService],
})
export class SubscriptionInvoicesModule {}
