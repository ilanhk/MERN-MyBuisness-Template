import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '@prisma/client';
import { PrismaService } from '../infrastructure/prisma.service';
import { RedisService } from '../infrastructure/redis.service';

const CACHE_TTL_SECONDS = 86400;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class ServicesService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    const client = this.redis.getClient();
    const cached = await client?.get('services');
    if (cached) return JSON.parse(cached);

    const services = await this.prisma.client.service.findMany({ orderBy: { createdAt: 'desc' } });
    const response = services.map((service) => this.toResponse(service));
    await client?.set('services', JSON.stringify(response), { EX: CACHE_TTL_SECONDS });
    return response;
  }

  async findById(id: string) {
    const client = this.redis.getClient();
    const cacheKey = `service:${id}`;
    const cached = await client?.get(cacheKey);
    if (cached) return JSON.parse(cached);

    if (!UUID_PATTERN.test(id)) throw new NotFoundException({ message: 'Service not found' });
    const service = await this.prisma.client.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException({ message: 'Service not found' });
    const response = this.toResponse(service);
    await client?.set(cacheKey, JSON.stringify(response), { EX: CACHE_TTL_SECONDS });
    return response;
  }

  async create(data: Record<string, unknown>) {
    const name = this.requiredString(data.name, 'name');
    const image = this.requiredString(data.image, 'image');
    const description = this.requiredString(data.description, 'description');
    const service = await this.prisma.client.service.create({ data: { name, image, description } });
    await this.invalidateAll();
    return this.toResponse(service);
  }

  async update(id: string, data: Record<string, unknown>) {
    if (!UUID_PATTERN.test(id)) throw new NotFoundException({ message: 'Service not found' });
    const existing = await this.prisma.client.service.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException({ message: 'Service not found' });

    const update: Record<string, unknown> = {};
    if (typeof data.name === 'string' && data.name.trim()) update.name = data.name;
    if (typeof data.image === 'string' && data.image.trim()) update.image = data.image;
    if (typeof data.description === 'string' && data.description.trim()) update.description = data.description;
    if (typeof data.isChosen === 'boolean') update.isChosen = data.isChosen;

    const updatedService = await this.prisma.client.service.update({ where: { id }, data: update });
    await this.invalidate(id);
    return this.toResponse(updatedService);
  }

  async delete(id: string) {
    if (!UUID_PATTERN.test(id)) throw new NotFoundException({ message: 'Service not found' });
    const existing = await this.prisma.client.service.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException({ message: 'Service not found' });
    await this.prisma.client.service.delete({ where: { id } });
    await this.invalidate(id);
    return { message: 'Service deleted successfuly' };
  }

  private toResponse(service: Service) {
    return {
      _id: service.id,
      name: service.name,
      image: service.image,
      description: service.description,
      isChosen: service.isChosen,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }

  private requiredString(value: unknown, field: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new BadRequestException({ message: `Please add name, image and description of the service` });
    }
    return value.trim();
  }

  private async invalidate(id: string) {
    await this.redis.getClient()?.del([`service:${id}`, 'services']);
  }

  private async invalidateAll() {
    await this.redis.getClient()?.del('services');
  }
}

