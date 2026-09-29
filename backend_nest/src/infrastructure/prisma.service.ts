import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private prismaClient: PrismaClient | null = null;
  private connected = false;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    if (this.isDisabled()) {
      this.logger.warn('PostgreSQL connection disabled.');
      return;
    }

    const connectionString = this.config.get<string>('DATABASE_URL');
    if (!connectionString) {
      this.logger.warn('DATABASE_URL is not set; PostgreSQL remains unused.');
      return;
    }

    this.prismaClient = new PrismaClient({
      datasources: { db: { url: connectionString } },
    });

    try {
      await this.prismaClient.$connect();
      await this.prismaClient.$queryRaw`SELECT 1`;
      this.connected = true;
      this.logger.log('PostgreSQL connected through Prisma.');
    } catch {
      await this.prismaClient.$disconnect();
      this.prismaClient = null;
      throw new Error('PostgreSQL connection failed. Check DATABASE_URL and network access.');
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.prismaClient) {
      await this.prismaClient.$disconnect();
      this.prismaClient = null;
      this.connected = false;
      this.logger.log('PostgreSQL connection closed.');
    }
  }

  get client(): PrismaClient {
    if (!this.prismaClient) {
      throw new Error('Prisma is not connected. Set DATABASE_URL and enable infrastructure first.');
    }
    return this.prismaClient;
  }

  isReady(): boolean {
    return this.connected;
  }

  isConfigured(): boolean {
    return !this.isDisabled() && Boolean(this.config.get<string>('DATABASE_URL'));
  }

  private isDisabled(): boolean {
    return this.config.get<string>('ENABLE_INFRASTRUCTURE') === 'false'
      || this.config.get<string>('NODE_ENV') === 'test';
  }
}