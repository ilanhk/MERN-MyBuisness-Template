import { Injectable, NotFoundException } from '@nestjs/common';
import { Job } from '@prisma/client';
import { PrismaService } from '../infrastructure/prisma.service';
import { RedisService } from '../infrastructure/redis.service';

const CACHE_TTL_SECONDS = 86400;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class JobsService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    const client = this.redis.getClient();
    const cached = await client?.get('jobs');
    if (cached) return JSON.parse(cached);

    const jobs = await this.prisma.client.job.findMany({ orderBy: { createdAt: 'desc' } });
    const response = jobs.map((job) => this.toResponse(job));
    await client?.set('jobs', JSON.stringify(response), { EX: CACHE_TTL_SECONDS });
    return response;
  }

  async findById(id: string) {
    const client = this.redis.getClient();
    const cacheKey = `job:${id}`;
    const cached = await client?.get(cacheKey);
    if (cached) return JSON.parse(cached);

    if (!UUID_PATTERN.test(id)) throw new NotFoundException({ message: 'Job not found' });
    const job = await this.prisma.client.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException({ message: 'Job not found' });
    const response = this.toResponse(job);
    await client?.set(cacheKey, JSON.stringify(response), { EX: CACHE_TTL_SECONDS });
    return response;
  }

  async create() {
    const job = await this.prisma.client.job.create({
      data: {
        name: 'Sample name',
        department: 'Sample category',
        position: 'Sample position',
        yourRole: 'Sample your role',
        qualifications: 'Sample qualifications',
        advantagesToHave: 'Sample advantages',
        city: 'Sample city',
        country: 'Sample country',
        jobType: 'Sample job type',
      },
    });
    await this.redis.getClient()?.del('jobs');
    return this.toResponse(job);
  }

  async update(id: string, patch: Record<string, unknown>) {
    if (!UUID_PATTERN.test(id)) throw new NotFoundException({ message: 'Job not found' });
    const existing = await this.prisma.client.job.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException({ message: 'Job not found' });

    const description = this.isObject(patch.description) ? patch.description : {};
    const location = this.isObject(patch.location) ? patch.location : {};

    const update: Record<string, unknown> = {};
    if (typeof patch.name === 'string') update.name = patch.name;
    if (typeof patch.department === 'string') update.department = patch.department;
    if (typeof patch.jobType === 'string') update.jobType = patch.jobType;
    if (typeof description.position === 'string') update.position = description.position;
    if (typeof description.yourRole === 'string') update.yourRole = description.yourRole;
    if (typeof description.qualifications === 'string') update.qualifications = description.qualifications;
    if (typeof description.advantagesToHave === 'string') update.advantagesToHave = description.advantagesToHave;
    if (typeof location.city === 'string') update.city = location.city;
    if (typeof location.country === 'string') update.country = location.country;

    const updated = await this.prisma.client.job.update({ where: { id }, data: update });
    await this.redis.getClient()?.del([`job:${id}`, 'jobs']);
    return this.toResponse(updated);
  }

  async delete(id: string) {
    if (!UUID_PATTERN.test(id)) throw new NotFoundException({ message: 'Job not found' });
    const existing = await this.prisma.client.job.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException({ message: 'Job not found' });
    await this.prisma.client.job.delete({ where: { id } });
    await this.redis.getClient()?.del([`job:${id}`, 'jobs']);
    return { message: 'Job deleted successfuly' };
  }

  private toResponse(job: Job) {
    return {
      _id: job.id,
      name: job.name,
      department: job.department,
      description: {
        position: job.position,
        yourRole: job.yourRole,
        qualifications: job.qualifications,
        advantagesToHave: job.advantagesToHave,
      },
      location: { city: job.city, country: job.country },
      jobType: job.jobType,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}

