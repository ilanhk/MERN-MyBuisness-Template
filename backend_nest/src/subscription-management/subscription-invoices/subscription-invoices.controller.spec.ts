import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionInvoicesController } from './subscription-invoices.controller';
import { SubscriptionInvoicesService } from './subscription-invoices.service';

describe('SubscriptionInvoicesController', () => {
  let controller: SubscriptionInvoicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionInvoicesController],
      providers: [SubscriptionInvoicesService],
    }).compile();

    controller = module.get<SubscriptionInvoicesController>(SubscriptionInvoicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
