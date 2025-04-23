import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redisUri from './config/redis-uri';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        stores: [createKeyv(redisUri(config))],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
