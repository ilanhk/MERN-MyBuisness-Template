import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../infrastructure/redis.service';
import { CompanyInfoDocument, CompanyInfoModel } from './company-info.schema';

const CACHE_TTL_SECONDS = 86400;

@Injectable()
export class CompanyInfoService {
  constructor(private readonly redis: RedisService) {}

  async findAll() {
    return CompanyInfoModel.find().lean().exec();
  }

  async findById(id: string) {
    const client = this.redis.getClient();
    const cacheKey = `companyInfo:${id}`;
    const cached = await client?.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const companyInfo = await CompanyInfoModel.findById(id).lean().exec();
    if (!companyInfo) throw new NotFoundException({ message: 'Company Info not found' });
    await client?.set(cacheKey, JSON.stringify(companyInfo), { EX: CACHE_TTL_SECONDS });
    return companyInfo;
  }

  async create() {
    const companyInfo = await CompanyInfoModel.create({
      company: { name: 'MyBusiness', logoImage: '', companyType: { isEcommerce: false, hasProducts: false } },
      home: { valueProposition: { proposition: 'Our value proposition goes here', callToAction: 'Get Started with Us', image: '' }, customerSection: { title: 'Our Customers', description: 'Description about customers and how we help them.' } },
      about: { title: 'About Our Company', description: 'We are a company dedicated to providing top-notch services.', image: 'sample-image-url.jpg' },
      services: { title: 'Our Services', description: 'Description of the various services we offer.' },
      contactUs: { title: 'Contact Us', description: 'Reach out to us for more information.' },
    });
    return companyInfo;
  }

  async update(id: string, patch: Record<string, unknown>) {
    const companyInfo = await CompanyInfoModel.findById(id).exec();
    if (!companyInfo) throw new NotFoundException({ message: 'Company Info not found' });

    this.mergeNested(companyInfo, patch);
    const updated = await companyInfo.save();
    await this.redis.getClient()?.del(`companyInfo:${id}`);
    return updated;
  }

  async delete(id: string) {
    const companyInfo = await CompanyInfoModel.findById(id).exec();
    if (!companyInfo) throw new NotFoundException({ message: 'Company Info not found' });
    await CompanyInfoModel.deleteOne({ _id: id }).exec();
    await this.redis.getClient()?.del(`companyInfo:${id}`);
    return { message: 'Company Info deleted successfuly' };
  }

  private mergeNested(target: CompanyInfoDocument, patch: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(patch)) {
      if (this.isPlainObject(value) && this.isPlainObject(target.get(key))) {
        target.set(key, this.mergeObjects(target.get(key) as Record<string, unknown>, value));
      } else if (value !== undefined) {
        target.set(key, value);
      }
    }
  }

  private mergeObjects(target: Record<string, unknown>, patch: Record<string, unknown>) {
    const merged = { ...target };
    for (const [key, value] of Object.entries(patch)) {
      if (this.isPlainObject(value) && this.isPlainObject(merged[key])) {
        merged[key] = this.mergeObjects(merged[key] as Record<string, unknown>, value);
      } else if (value !== undefined) {
        merged[key] = value;
      }
    }
    return merged;
  }

  private isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
