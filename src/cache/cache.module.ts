import { Module } from '@nestjs/common';
import { UsersCacheModule } from './users-cache';
import { MessagesCacheModule } from './messages-cache';
import { CacheService } from './cache.service';

@Module({
  imports: [UsersCacheModule, MessagesCacheModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
