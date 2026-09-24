import { Controller, Get } from '@nestjs/common';
import { MongoDatabaseService } from '../infrastructure/mongo-database.service';
import { RedisService } from '../infrastructure/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly mongo: MongoDatabaseService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  getHealth() {
    return {
      status: this.mongo.isReady() && this.redis.isReady() ? 'ok' : 'degraded',
      service: 'backend-nest',
      dependencies: {
        mongo: this.mongo.isReady(),
        redis: this.redis.isReady(),
      },
    };
  }
}
