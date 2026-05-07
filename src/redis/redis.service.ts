import { Inject, Injectable } from '@nestjs/common';
import { type RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType;

  async listGet(key: string): Promise<string[]> {
    return await this.redisClient.lRange(key, 0, -1);
  }

  async listSet(key: string, list: Array<string>, ttl?: number): Promise<void> {
    for (const item of list) {
      await this.redisClient.lPush(key, item);
    }
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}
