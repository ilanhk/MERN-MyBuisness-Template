import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType | null = null;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    if (this.isDisabled()) {
      this.logger.warn('Redis connection disabled.');
      return;
    }

    const host = this.config.get<string>('REDIS_HOST') ?? 'redis';
    const port = this.config.get<number>('REDIS_PORT') ?? 6379;
    const password = this.config.get<string>('REDIS_PASSWORD');

    this.client = createClient({
      socket: { host, port, timeout: 10000 },
      password: password || undefined,
    });
    this.client.on('error', (error) => this.logger.error(error.message));
    await this.client.connect();
    this.logger.log(`Redis connected: ${host}:${port}`);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client?.isOpen) {
      await this.client.quit();
      this.logger.log('Redis connection closed.');
    }
  }

  isReady(): boolean {
    return this.client?.isReady ?? false;
  }

  getClient(): RedisClientType | null {
    return this.client;
  }

  private isDisabled(): boolean {
    return this.config.get<string>('ENABLE_INFRASTRUCTURE') === 'false'
      || this.config.get<string>('NODE_ENV') === 'test';
  }
}
