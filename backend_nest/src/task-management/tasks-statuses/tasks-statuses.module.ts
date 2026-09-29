import { Module } from '@nestjs/common';
import { TasksStatusesService } from './tasks-statuses.service';
import { TasksStatusesController } from './tasks-statuses.controller';

@Module({
  controllers: [TasksStatusesController],
  providers: [TasksStatusesService],
})
export class TasksStatusesModule {}
