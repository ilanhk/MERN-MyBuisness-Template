import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDatabaseService } from './mongo-database.service';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MongoDatabaseService, PrismaService, RedisService],
  exports: [MongoDatabaseService, PrismaService, RedisService],
})
export class InfrastructureModule {}
