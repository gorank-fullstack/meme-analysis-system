import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  Optional,
  StreamableFile,
} from '@nestjs/common';
import { isFunction, isNil } from '@nestjs/common/utils/shared.utils';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
} from '../redis.constants';
/*   import {
    CACHE_KEY_METADATA,
    CACHE_MANAGER,
    CACHE_TTL_METADATA,
  } from './cache.constants'; */
//   import { Redis } from 'ioredis';
import { Redis as IoRedis } from 'ioredis';

@Injectable()
export class RedisPlusInterceptor implements NestInterceptor {
  protected readonly logger = new Logger(RedisPlusInterceptor.name);

  protected allowedMethods = ['GET'];

  constructor(
    //   @Inject(CACHE_MANAGER) protected readonly redisClient: Redis,
    // @Inject('REDIS_CLIENT') protected readonly redisClient: IoRedis,
    private readonly redisClient: IoRedis,
    private readonly reflector: Reflector,
    @Optional() private readonly httpAdapterHost?: HttpAdapterHost,
  ) { }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    //使用：键名，支持查询参数的
    const key = this.trackBy_Support_Query_Param(context);
    if (!key) return next.handle();

    const ttlValueOrFactory =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ??
      this.reflector.get(CACHE_TTL_METADATA, context.getClass()) ??
      null;

    // console.log('class Name:',RedisPlusInterceptor.name);
    try {
      const cached = await this.redisClient.get(key);
      this.setHeadersWhenHttp(context, cached);

      if (!isNil(cached)) {
        console.log(new Date(), '缓存命中：key=', key);
        return of(JSON.parse(cached));
      }

      const ttl = isFunction(ttlValueOrFactory)
        ? await ttlValueOrFactory(context)
        : ttlValueOrFactory;

      return next.handle().pipe(
        tap(async (response) => {
          if (response instanceof StreamableFile) return;

          try {
            const payload = JSON.stringify(response);
            if (!isNil(ttl)) {
              //setex 秒，
              await this.redisClient.setex(key, ttl, payload);
            } else {
              await this.redisClient.set(key, payload);
            }
          } catch (err) {
            this.logger.error(
              `Failed to cache key "${key}"`,
              err.stack,
            );
          }//End catch
        }),
      );
    } catch (err) {
      this.logger.warn(`Redis error: ${err.message}`);
      return next.handle();
    }
  }

  //获取键名，支持查询参数
  protected trackBy_Support_Query_Param(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost?.httpAdapter;
    if (!httpAdapter) return undefined;

    const request = context.switchToHttp().getRequest();
    if (!this.isRequestCacheable(context)) return undefined;

    // const method = request.method;
    const method = request.method?.toUpperCase?.() || 'GET';
    const url = httpAdapter.getRequestUrl(request);
    const query = request.query;

    // 拼接 query 参数到 key 中
    const queryPart = Object.keys(query)
    // 这里 .sort() 的作用是：对 GET /xxx?minFdv=100&keyword=abc 
    // 和 GET /xxx?keyword=abc&minFdv=100 生成相同的 key，避免查询字段排序错乱
      .sort()
      .map((key) => `${key}=${query[key]}`)
      .join('&');

    const fullKey = queryPart ? `${method}:${url}?${queryPart}` : `${method}:${url}`;

    return fullKey;
  }

  //获取键名，不支持查询参数
  protected trackBy_NotSupport_Query_Param(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost?.httpAdapter;
    const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;

    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    if (!isHttpApp || cacheKey) {
      return cacheKey;
    }

    const request = context.getArgByIndex(0);
    if (!this.isRequestCacheable(context)) return undefined;

    const method = request.method || 'GET';
    const url = httpAdapter.getRequestUrl(request);

    // return `cache:${method}:${url}`;
    return `${method}:${url}`;
  }

  protected isRequestCacheable(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return this.allowedMethods.includes(req.method);
  }

  protected setHeadersWhenHttp(context: ExecutionContext, value: any): void {
    if (!this.httpAdapterHost) return;

    const { httpAdapter } = this.httpAdapterHost;
    if (!httpAdapter) return;

    const response = context.switchToHttp().getResponse();
    httpAdapter.setHeader(response, 'X-Cache', isNil(value) ? 'MISS' : 'HIT');
  }
}
