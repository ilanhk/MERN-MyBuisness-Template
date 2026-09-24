import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../infrastructure/redis.service';
import { JobDocument, JobModel } from './job.schema';

const CACHE_TTL_SECONDS = 86400;

@Injectable()
export class JobsService {
  constructor(private readonly redis: RedisService) {}

  async findAll() {
    const client = this.redis.getClient();
    const cached = await client?.get('jobs');
    if (cached) return JSON.parse(cached);

    const jobs = await JobModel.find().lean().exec();
    await client?.set('jobs', JSON.stringify(jobs), { EX: CACHE_TTL_SECONDS });
    return jobs;
  }

  async findById(id: string) {
    const client = this.redis.getClient();
    const cacheKey = `job:${id}`;
    const cached = await client?.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const job = await JobModel.findById(id).lean().exec();
    if (!job) throw new NotFoundException({ message: 'Job not found' });
    await client?.set(cacheKey, JSON.stringify(job), { EX: CACHE_TTL_SECONDS });
    return job;
  }

  async create() {
    const job = await JobModel.create({
      name: 'Sample name',
      department: 'Sample category',
      description: {
        position: 'Sample position',
        yourRole: 'Sample your role',
        qualifications: 'Sample qualifications',
        advantagesToHave: 'Sample advantages',
      },
      location: { city: 'Sample city', country: 'Sample country' },
      jobType: 'Sample job type',
    });
    await this.redis.getClient()?.del('jobs');
    return job;
  }

  async update(id: string, patch: Record<string, unknown>) {
    const job = await JobModel.findById(id).exec();
    if (!job) throw new NotFoundException({ message: 'Job not found' });

    if (typeof patch.name === 'string') job.name = patch.name;
    if (typeof patch.department === 'string') job.department = patch.department;
    if (typeof patch.jobType === 'string') job.jobType = patch.jobType;
    if (this.isObject(patch.description)) job.description = { ...job.description, ...patch.description } as Record<string, string>;
    if (this.isObject(patch.location)) job.location = { ...job.location, ...patch.location } as Record<string, string>;

    const updated = await job.save();
    await this.redis.getClient()?.del([`job:${id}`, 'jobs']);
    return updated;
  }

  async delete(id: string) {
    const job = await JobModel.findById(id).exec();
    if (!job) throw new NotFoundException({ message: 'Job not found' });
    await JobModel.deleteOne({ _id: id }).exec();
    await this.redis.getClient()?.del([`job:${id}`, 'jobs']);
    return { message: 'Job deleted successfuly' };
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
