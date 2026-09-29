import { Test, TestingModule } from '@nestjs/testing';
import { CompanyInfoHistoryController } from './company-info-history.controller';
import { CompanyInfoHistoryService } from './company-info-history.service';

describe('CompanyInfoHistoryController', () => {
  let controller: CompanyInfoHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyInfoHistoryController],
      providers: [CompanyInfoHistoryService],
    }).compile();

    controller = module.get<CompanyInfoHistoryController>(CompanyInfoHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
