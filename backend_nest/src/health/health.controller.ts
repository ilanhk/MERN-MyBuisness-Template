import { Controller, Get } from '@nestjs/common';
import { MongoDatabaseService } from '../infrastructure/mongo-database.service';
import { PrismaService } from '../infrastructure/prisma.service';
import { RedisService } from '../infrastructure/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly mongo: MongoDatabaseService,
    private readonly postgres: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  getHealth() {
    const postgresConfigured = this.postgres.isConfigured();
    const postgresReady = this.postgres.isReady();

    return {
      status: this.mongo.isReady() && this.redis.isReady() && (!postgresConfigured || postgresReady) ? 'ok' : 'degraded',
      service: 'backend-nest',
      dependencies: {
        mongo: this.mongo.isReady(),
        postgres: postgresReady,
        postgresConfigured,
        redis: this.redis.isReady(),
      },
    };
  }
}
