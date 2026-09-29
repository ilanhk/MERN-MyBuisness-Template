import { Injectable } from '@nestjs/common';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';

@Injectable()
export class TaskCommentsService {
  create(createTaskCommentDto: CreateTaskCommentDto) {
    return 'This action adds a new taskComment';
  }

  findAll() {
    return `This action returns all taskComments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskComment`;
  }

  update(id: number, updateTaskCommentDto: UpdateTaskCommentDto) {
    return `This action updates a #${id} taskComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskComment`;
  }
}
