import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDatabaseService } from './mongo-database.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MongoDatabaseService, RedisService],
  exports: [MongoDatabaseService, RedisService],
})
export class InfrastructureModule {}
