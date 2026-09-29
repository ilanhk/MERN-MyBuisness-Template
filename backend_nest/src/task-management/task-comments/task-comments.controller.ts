import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskCommentsService } from './task-comments.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';

@Controller('task-comments')
export class TaskCommentsController {
  constructor(private readonly taskCommentsService: TaskCommentsService) {}

  @Post()
  create(@Body() createTaskCommentDto: CreateTaskCommentDto) {
    return this.taskCommentsService.create(createTaskCommentDto);
  }

  @Get()
  findAll() {
    return this.taskCommentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskCommentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskCommentDto: UpdateTaskCommentDto) {
    return this.taskCommentsService.update(+id, updateTaskCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskCommentsService.remove(+id);
  }
}
