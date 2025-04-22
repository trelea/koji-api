import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class MessagesCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly messagesCache: Cache) {}

  async get(key: string) {
    return await this.messagesCache.get(key);
  }

  async set(key: string, val: unknown, ttl?: number) {
    return await this.messagesCache.set(key, val, ttl);
  }

  async del(key: string) {
    return this.messagesCache.del(key);
  }
}
