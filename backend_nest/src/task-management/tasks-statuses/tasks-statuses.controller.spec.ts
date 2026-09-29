import { Test, TestingModule } from '@nestjs/testing';
import { TasksStatusesController } from './tasks-statuses.controller';
import { TasksStatusesService } from './tasks-statuses.service';

describe('TasksStatusesController', () => {
  let controller: TasksStatusesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksStatusesController],
      providers: [TasksStatusesService],
    }).compile();

    controller = module.get<TasksStatusesController>(TasksStatusesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
