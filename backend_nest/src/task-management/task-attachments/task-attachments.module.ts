import { Module } from '@nestjs/common';
import { TaskAttachmentsService } from './task-attachments.service';
import { TaskAttachmentsController } from './task-attachments.controller';

@Module({
  controllers: [TaskAttachmentsController],
  providers: [TaskAttachmentsService],
})
export class TaskAttachmentsModule {}
