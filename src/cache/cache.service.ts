import { Injectable } from '@nestjs/common';

import { CACHE_NAMESPACE, CacheServicesType } from './config';
import { UsersCacheService } from './users-cache';
import { MessagesCacheService } from './messages-cache';

@Injectable()
export class CacheService {
  private _namespace: CACHE_NAMESPACE | null = null;
  constructor(
    private readonly usersCache: UsersCacheService,
    private readonly messagesCache: MessagesCacheService,
  ) {}

  namespace(ns: CACHE_NAMESPACE): CacheService {
    this._namespace = ns;
    return this;
  }

  private async use<T = unknown>(
    callback: (cacheStore: CacheServicesType) => Promise<T>,
  ): Promise<T> {
    if (!this._namespace) throw new Error('Namespace null');

    if (this._namespace === CACHE_NAMESPACE.MESSAGES)
      return await callback(this.messagesCache);

    if (this._namespace === CACHE_NAMESPACE.USERS)
      return await callback(this.usersCache);

    this._namespace = null;
    throw new Error('Invalid Namespace');
  }

  async set<T = unknown>(key: string, val: unknown, ttl?: number): Promise<T> {
    return await this.use<T>(
      async (cache: CacheServicesType): Promise<T> =>
        (await cache.set(key, val, ttl)) as T,
    );
  }

  async get<T = unknown>(key: string): Promise<T> {
    return await this.use<T>(
      async (cache: CacheServicesType) => (await cache.get(key)) as T,
    );
  }

  async del(key: string): Promise<boolean> {
    return await this.use(
      async (cache: CacheServicesType) => await cache.del(key),
    );
  }
}
