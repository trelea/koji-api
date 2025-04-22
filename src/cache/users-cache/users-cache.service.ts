import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User } from 'src/entities';

@Injectable()
export class UsersCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly usersCache: Cache) {}

  async get(key: string): Promise<User | null> {
    return await this.usersCache.get(key);
  }

  async set(key: string, val: unknown, ttl?: number): Promise<User | unknown> {
    return await this.usersCache.set<User | unknown>(key, val, ttl);
  }

  async del(key: string): Promise<boolean> {
    return this.usersCache.del(key);
  }
}
