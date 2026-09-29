import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteStylesHistoryService } from './website-styles-history.service';

describe('WebsiteStylesHistoryService', () => {
  let service: WebsiteStylesHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsiteStylesHistoryService],
    }).compile();

    service = module.get<WebsiteStylesHistoryService>(WebsiteStylesHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
