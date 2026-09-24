import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Injectable()
export class MongoDatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoDatabaseService.name);
  private connected = false;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    if (this.isDisabled()) {
      this.logger.warn('MongoDB connection disabled.');
      return;
    }

    const uri = this.config.get<string>('MONGO_URI');
    if (!uri) {
      throw new Error('MONGO_URI must be set before starting the NestJS backend.');
    }

    const connection = await mongoose.connect(uri);
    this.connected = connection.connection.readyState === 1;
    this.logger.log(`MongoDB connected: ${connection.connection.host}`);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.connected) {
      await mongoose.disconnect();
      this.connected = false;
      this.logger.log('MongoDB connection closed.');
    }
  }

  isReady(): boolean {
    return this.connected;
  }

  private isDisabled(): boolean {
    return this.config.get<string>('ENABLE_INFRASTRUCTURE') === 'false'
      || this.config.get<string>('NODE_ENV') === 'test';
  }
}
