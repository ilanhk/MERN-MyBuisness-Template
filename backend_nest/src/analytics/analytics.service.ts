import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductClickedModel } from './product-clicked.schema';
import { WebTrafficModel } from './web-traffic.schema';

@Injectable()
export class AnalyticsService {
  async addProductClick(body: Record<string, unknown>) {
    if (typeof body.productId !== 'string' || !Types.ObjectId.isValid(body.productId)) {
      throw new BadRequestException({ message: 'A valid productId is required' });
    }
    return ProductClickedModel.create({ productId: body.productId });
  }

  async addWebTraffic(body: Record<string, unknown>) {
    const required = ['ipAddress', 'url', 'userAgent'];
    if (required.some((field) => typeof body[field] !== 'string' || !(body[field] as string).trim())) {
      throw new BadRequestException({ message: 'ipAddress, url and userAgent are required' });
    }
    return WebTrafficModel.create({
      ipAddress: body.ipAddress,
      url: body.url,
      userAgent: body.userAgent,
      referrer: typeof body.referrer === 'string' ? body.referrer : undefined,
      userId: typeof body.userId === 'string' ? body.userId : undefined,
    });
  }
}
