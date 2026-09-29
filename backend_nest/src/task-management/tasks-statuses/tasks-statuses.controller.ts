import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksStatusesService } from './tasks-statuses.service';
import { CreateTasksStatusDto } from './dto/create-tasks-status.dto';
import { UpdateTasksStatusDto } from './dto/update-tasks-status.dto';

@Controller('tasks-statuses')
export class TasksStatusesController {
  constructor(private readonly tasksStatusesService: TasksStatusesService) {}

  @Post()
  create(@Body() createTasksStatusDto: CreateTasksStatusDto) {
    return this.tasksStatusesService.create(createTasksStatusDto);
  }

  @Get()
  findAll() {
    return this.tasksStatusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksStatusesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTasksStatusDto: UpdateTasksStatusDto) {
    return this.tasksStatusesService.update(+id, updateTasksStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksStatusesService.remove(+id);
  }
}
