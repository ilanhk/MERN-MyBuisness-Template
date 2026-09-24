import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../user-management/auth/guards/cookie-token.guard';
import { Roles } from '../user-management/auth/decorators/roles.decorator';
import { RolesGuard } from '../user-management/auth/guards/roles.guard';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobs: JobsService) {}

  @Get()
  getJobs() {
    return this.jobs.findAll();
  }

  @Get(':id')
  getJob(@Param('id') id: string) {
    return this.jobs.findById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('employee')
  createJob() {
    return this.jobs.create();
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('employee')
  updateJob(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.jobs.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('employee')
  deleteJob(@Param('id') id: string) {
    return this.jobs.delete(id);
  }
}
