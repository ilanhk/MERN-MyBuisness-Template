import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../infrastructure/redis.service';
import { ProductDocument, ProductModel } from './product.schema';

const CACHE_TTL_SECONDS = 86400;

@Injectable()
export class ProductsService {
  constructor(private readonly redis: RedisService) {}

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

    const product = await ProductModel.findById(id).lean().exec();
    if (!product) throw new NotFoundException({ message: 'Resource not found' });
    await client?.set(cacheKey, JSON.stringify(product), { EX: CACHE_TTL_SECONDS });
    return product;
  }

  async create() {
    const product = await ProductModel.create({
      name: 'Sample name',
      price: 0,
      supplierPrice: 0,
      image: '/images/sample.jpg',
      supplier: 'Sample supplier',
      category: 'Sample category',
      description: 'Sample description',
      isChosen: false,
    });
    await this.invalidateAll();
    return product;
  }

  async update(id: string, data: Record<string, unknown>) {
    const product = await ProductModel.findById(id).exec();
    if (!product) throw new NotFoundException({ message: 'Resource not found' });

    if (typeof data.name === 'string') product.name = data.name;
    if (typeof data.price === 'number') product.price = data.price;
    if (typeof data.supplierPrice === 'number') product.supplierPrice = data.supplierPrice;
    if (typeof data.description === 'string') product.description = data.description;
    if (typeof data.image === 'string') product.image = data.image;
    if (typeof data.supplier === 'string') product.supplier = data.supplier;
    if (typeof data.category === 'string') product.category = data.category;
    if (typeof data.isChosen === 'boolean') product.isChosen = data.isChosen;

    const updatedProduct = await product.save();
    await this.invalidate(id);
    return updatedProduct;
  }

  async delete(id: string) {
    const product = await ProductModel.findById(id).exec();
    if (!product) throw new NotFoundException({ message: 'Product not found' });
    await ProductModel.deleteOne({ _id: id }).exec();
    await this.invalidate(id);
    return 'Product deleted';
  }

  private async getCachedProducts(): Promise<Array<{ name: string } & Record<string, unknown>>> {
    const client = this.redis.getClient();
    const cached = await client?.get('products');
    if (cached) return JSON.parse(cached);

    const products = await ProductModel.find().lean().exec();
    await client?.set('products', JSON.stringify(products), { EX: CACHE_TTL_SECONDS });
    return products as Array<{ name: string } & Record<string, unknown>>;
  }

  private async invalidate(id: string) {
    const client = this.redis.getClient();
    await client?.del([`product:${id}`, 'products']);
  }

  private async invalidateAll() {
    await this.redis.getClient()?.del('products');
  }
}
