// redis-cache.interceptor.ts
import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
    Optional,
    StreamableFile,
    Logger,
} from '@nestjs/common';
import { Reflector, HttpAdapterHost } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isFunction, isNil } from '@nestjs/common/utils/shared.utils';
//   import type Redis from 'ioredis';
import { Redis as IoRedis } from 'ioredis';
import {
    CACHE_KEY_METADATA,
    CACHE_TTL_METADATA,
  } from '../redis.constants';

@Injectable()
//ioRedis升级版拦截器.参考：nestjs\cache-manager\interceptors\cache.interceptor.ts写的，使用自定义的redis缓存拦截器。避免使用cache-manager的缓存拦哉器
export class RedisPlusOldInterceptor implements NestInterceptor {
    protected readonly allowedMethods = ['GET'];

    constructor(
        //   @Inject('REDIS_CLIENT') private readonly redisClient: IoRedis,
        private readonly redisClient: IoRedis,
        private readonly reflector: Reflector,
        @Optional() private readonly httpAdapterHost?: HttpAdapterHost,
    ) { }

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const key = this.trackBy(context);

        const ttl =
            // this.reflector.get<number>('cache_ttl', context.getHandler()) ??
            this.reflector.get<number>(CACHE_TTL_METADATA, context.getHandler()) ??
            null;
        console.log('key=', key);
        console.log('ttl=', ttl);

        if (!key) {
            return next.handle();
        }

        try {
            const cached = await this.redisClient.get(key);
            this.setHeaders(context, cached);

            if (!isNil(cached)) {
                return of(JSON.parse(cached));
            }

            return next.handle().pipe(
                tap(async (response) => {
                    if (response instanceof StreamableFile) return;

                    try {
                        await this.redisClient.set(key, JSON.stringify(response));
                        if (ttl) {
                            await this.redisClient.expire(key, ttl);
                        }
                    } catch (err) {
                        Logger.error(`Redis SET error: ${err}`, err.stack, 'RedisCacheInterceptor');
                    }
                }),
            );
        } catch (err) {
            Logger.warn(`Redis cache failed: ${err}`, 'RedisCacheInterceptor');
            return next.handle();
        }
    }

    /* trackBy（）解释：
    它检查是否使用@CacheKey装饰器（this.reflector.get<string>（'ache_key'，处理程序）定义了自定义缓存键。如果找到，则返回:自定义key。
如果没有找到:自定义key，它会检查是否允许缓存当前的HTTP方法（例如GET、POST、PUT等）（this.allowedMethods.includes（method））。如果没有，则返回undefined。
如果允许该方法，它将根据请求URL（adapter？.getRequestUrl（req））生成缓存密钥。
总之，此方法从自定义装饰器或请求URL返回当前HTTP请求的缓存键，如果请求方法不可缓存，则返回undefined。
     */
    private trackBy(context: ExecutionContext): string | undefined {
        const handler = context.getHandler();

        // const customKey = this.reflector.get<string>('cache_key', handler);
        const customKey = this.reflector.get<string>(CACHE_KEY_METADATA, handler);
        if (customKey) return customKey;

        const req = context.switchToHttp().getRequest();
        const method = req.method;

        if (!this.allowedMethods.includes(method)) return;


        const adapter = this.httpAdapterHost?.httpAdapter;
        //   console.log(adapter?.getRequestUrl(req))
        return adapter?.getRequestUrl(req);
    }

    private setHeaders(context: ExecutionContext, cachedValue: any) {
        const adapter = this.httpAdapterHost?.httpAdapter;
        if (!adapter) return;

        const response = context.switchToHttp().getResponse();
        adapter.setHeader(response, 'X-Cache', isNil(cachedValue) ? 'MISS' : 'HIT');
    }
}

