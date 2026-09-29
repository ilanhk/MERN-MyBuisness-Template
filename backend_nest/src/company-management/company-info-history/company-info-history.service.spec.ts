import { Test, TestingModule } from '@nestjs/testing';
import { CompanyInfoHistoryService } from './company-info-history.service';

describe('CompanyInfoHistoryService', () => {
  let service: CompanyInfoHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyInfoHistoryService],
    }).compile();

    service = module.get<CompanyInfoHistoryService>(CompanyInfoHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
