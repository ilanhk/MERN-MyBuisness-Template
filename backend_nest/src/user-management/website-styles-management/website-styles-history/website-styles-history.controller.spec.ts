import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteStylesHistoryController } from './website-styles-history.controller';
import { WebsiteStylesHistoryService } from './website-styles-history.service';

describe('WebsiteStylesHistoryController', () => {
  let controller: WebsiteStylesHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsiteStylesHistoryController],
      providers: [WebsiteStylesHistoryService],
    }).compile();

    controller = module.get<WebsiteStylesHistoryController>(WebsiteStylesHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
