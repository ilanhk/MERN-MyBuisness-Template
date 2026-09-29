import { Test, TestingModule } from '@nestjs/testing';
import { TasksStatusesService } from './tasks-statuses.service';

describe('TasksStatusesService', () => {
  let service: TasksStatusesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksStatusesService],
    }).compile();

    service = module.get<TasksStatusesService>(TasksStatusesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
