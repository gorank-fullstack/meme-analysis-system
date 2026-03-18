import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { RedisCacheService } from './redis.service';
// import { RedisCacheInterceptor } from './redis.interceptor';
import { RedisPlusOldInterceptor } from './interceptors';
import { RedisPlusInterceptor } from './interceptors';

// import { CacheKey, CacheTTL } from './cache.decorators';
import { CacheKey, CacheTTL } from './decorators';

// import { CacheInterceptor} from '@nestjs/cache-manager';
// import { CacheInterceptor} from '../cache-manager/interceptors/cache.interceptor';

// @UseInterceptors(RedisPlusInterceptor) //ioRedis升级版拦截器.参考：nestjs\cache-manager\interceptors\cache.interceptor.ts写的，使用自定义的redis缓存拦截器。避免使用cache-manager的缓存拦哉器
@UseInterceptors(RedisPlusInterceptor) //ioRedis升级版拦截器.参考：nestjs\cache-manager\interceptors\cache.interceptor.ts写的，使用自定义的redis缓存拦截器。避免使用cache-manager的缓存拦哉器

//使用：CacheInterceptor，需要安装两个包：@nestjs/cache-manager cache-manager。
// 但用　ioredis，不需要这两个包。改为手动实现：Rediso缓存授拦器
// @UseInterceptors(CacheInterceptor) 
@Controller('redis')
export class RedisController {
  constructor(
    // 注意，这里和使用cache-manager不同，不需要使用：@Inject(CACHE_MANAGER)注入。
    // 这里操作的就是redis
    private readonly redisCacheService: RedisCacheService,
  ) { }


  @Get()
  // @CacheKey('custom-key:example1')
  @CacheTTL(20)
  //CacheTTL支持传入工厂函数
  /* @CacheTTL((ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user?.ttl || 30;
  }) */
  getRedis(): Promise<string> {
    return this.redisCacheService.testRedis();
  }
}
