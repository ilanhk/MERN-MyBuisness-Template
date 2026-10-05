import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionInvoicesService } from './subscription-invoices.service';

describe('SubscriptionInvoicesService', () => {
  let service: SubscriptionInvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionInvoicesService],
    }).compile();

    service = module.get<SubscriptionInvoicesService>(SubscriptionInvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
