import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionInvoiceDto } from './create-subscription-invoice.dto';

export class UpdateSubscriptionInvoiceDto extends PartialType(CreateSubscriptionInvoiceDto) {}
