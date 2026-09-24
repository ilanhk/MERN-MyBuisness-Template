import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../infrastructure/redis.service';
import { ServiceDocument, ServiceModel } from './service.schema';

const CACHE_TTL_SECONDS = 86400;

@Injectable()
export class ServicesService {
  constructor(private readonly redis: RedisService) {}

  async findAll() {
    const client = this.redis.getClient();
    const cached = await client?.get('services');
    if (cached) return JSON.parse(cached);

    const services = await ServiceModel.find().lean().exec();
    await client?.set('services', JSON.stringify(services), { EX: CACHE_TTL_SECONDS });
    return services;
  }

  async findById(id: string) {
    const client = this.redis.getClient();
    const cacheKey = `service:${id}`;
    const cached = await client?.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const service = await ServiceModel.findById(id).lean().exec();
    if (!service) throw new NotFoundException({ message: 'Service not found' });
    await client?.set(cacheKey, JSON.stringify(service), { EX: CACHE_TTL_SECONDS });
    return service;
  }

  async create(data: Record<string, unknown>) {
    const name = this.requiredString(data.name, 'name');
    const image = this.requiredString(data.image, 'image');
    const description = this.requiredString(data.description, 'description');
    const service = await ServiceModel.create({ name, image, description });
    await this.invalidateAll();
    return service;
  }

  async update(id: string, data: Record<string, unknown>) {
    const service = await ServiceModel.findById(id).exec();
    if (!service) throw new NotFoundException({ message: 'Service not found' });

    if (typeof data.name === 'string' && data.name.trim()) service.name = data.name;
    if (typeof data.image === 'string' && data.image.trim()) service.image = data.image;
    if (typeof data.description === 'string' && data.description.trim()) service.description = data.description;
    if (typeof data.isChosen === 'boolean') service.isChosen = data.isChosen;

    const updatedService = await service.save();
    await this.invalidate(id);
    return updatedService;
  }

  async delete(id: string) {
    const service = await ServiceModel.findById(id).exec();
    if (!service) throw new NotFoundException({ message: 'Service not found' });
    await ServiceModel.deleteOne({ _id: id }).exec();
    await this.invalidate(id);
    return { message: 'Service deleted successfuly' };
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
