import { PartialType } from '@nestjs/mapped-types';
import { CreateTasksStatusDto } from './create-tasks-status.dto';

export class UpdateTasksStatusDto extends PartialType(CreateTasksStatusDto) {}
