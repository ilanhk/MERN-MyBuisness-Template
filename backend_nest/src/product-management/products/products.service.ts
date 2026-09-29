import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../../infrastructure/redis.service';
import { PrismaService } from '../../infrastructure/prisma.service';
import { Product } from '@prisma/client';

const CACHE_TTL_SECONDS = 86400;

@Injectable()
export class ProductsService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(page: number, keyword: string) {
    const products = await this.getCachedProducts();
    const normalizedKeyword = keyword.toLowerCase();
    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(normalizedKeyword));
    const pageSize = 10;
    const selectedProducts = filteredProducts.slice(pageSize * (page - 1), pageSize * page);

    return {
      selectedProducts,
      page,
      pages: Math.ceil(filteredProducts.length / pageSize),
    };
  }

  async findById(id: string) {
    const client = this.redis.getClient();
    const cacheKey = `product:${id}`;
    const cached = await client?.get(cacheKey);
    if (cached) return JSON.parse(cached);

    if (!this.isUuid(id)) throw new NotFoundException({ message: 'Resource not found' });
    const product = await this.prisma.client.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException({ message: 'Resource not found' });
    const response = this.toResponse(product);
    await client?.set(cacheKey, JSON.stringify(response), { EX: CACHE_TTL_SECONDS });
    return response;
  }

  async create() {
    const product = await this.prisma.client.product.create({ data: {
      name: 'Sample name',
      price: 0,
      supplierPrice: 0,
      image: '/images/sample.jpg',
      supplier: 'Sample supplier',
      category: 'Sample category',
      description: 'Sample description',
      isChosen: false,
    } });
    await this.invalidateAll();
    return this.toResponse(product);
  }

  async update(id: string, data: Record<string, unknown>) {
    if (!this.isUuid(id)) throw new NotFoundException({ message: 'Resource not found' });
    const product = await this.prisma.client.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException({ message: 'Resource not found' });

    const updateData: Record<string, unknown> = {};
    if (typeof data.name === 'string') updateData.name = data.name;
    if (typeof data.price === 'number') updateData.price = data.price;
    if (typeof data.supplierPrice === 'number') updateData.supplierPrice = data.supplierPrice;
    if (typeof data.description === 'string') updateData.description = data.description;
    if (typeof data.image === 'string') updateData.image = data.image;
    if (typeof data.supplier === 'string') updateData.supplier = data.supplier;
    if (typeof data.category === 'string') updateData.category = data.category;
    if (typeof data.isChosen === 'boolean') updateData.isChosen = data.isChosen;

    const updatedProduct = await this.prisma.client.product.update({ where: { id }, data: updateData });
    await this.invalidate(id);
    return this.toResponse(updatedProduct);
  }

  async delete(id: string) {
    if (!this.isUuid(id)) throw new NotFoundException({ message: 'Product not found' });
    const product = await this.prisma.client.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException({ message: 'Product not found' });
    await this.prisma.client.product.delete({ where: { id } });
    await this.invalidate(id);
    return 'Product deleted';
  }

  private async getCachedProducts(): Promise<Array<ReturnType<ProductsService['toResponse']>>> {
    const client = this.redis.getClient();
    const cached = await client?.get('products');
    if (cached) return JSON.parse(cached);

    const products = await this.prisma.client.product.findMany({ orderBy: { createdAt: 'desc' } });
    const response = products.map((product) => this.toResponse(product));
    await client?.set('products', JSON.stringify(response), { EX: CACHE_TTL_SECONDS });
    return response;
  }

  private toResponse(product: Product) {
    return {
      _id: product.id,
      name: product.name,
      image: product.image,
      supplier: product.supplier,
      category: product.category,
      description: product.description,
      supplierPrice: Number(product.supplierPrice),
      price: Number(product.price),
      isChosen: product.isChosen,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  private async invalidate(id: string) {
    const client = this.redis.getClient();
    await client?.del([`product:${id}`, 'products']);
  }

  private async invalidateAll() {
    await this.redis.getClient()?.del('products');
  }
}
