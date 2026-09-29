import { Test, TestingModule } from '@nestjs/testing';
import { SupplierOrdersController } from './supplier-orders.controller';
import { SupplierOrdersService } from './supplier-orders.service';

describe('SupplierOrdersController', () => {
  let controller: SupplierOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierOrdersController],
      providers: [SupplierOrdersService],
    }).compile();

    controller = module.get<SupplierOrdersController>(SupplierOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
