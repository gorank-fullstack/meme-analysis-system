import { Injectable } from '@nestjs/common';
import { RedisCacheService } from './redis/redis.service';

@Injectable()
export class AppService {
  constructor(
    // 注意，这里和使用cache-manager不同，不需要使用：@Inject(CACHE_MANAGER)注入。
    // 这里操作的就是redis
    // private readonly redisCacheService: RedisCacheService,
  ) {}

  

  getHello(): string {
    return 'Hello World!';
  }
}
