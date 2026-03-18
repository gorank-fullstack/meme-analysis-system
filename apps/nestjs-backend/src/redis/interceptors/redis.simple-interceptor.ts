import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Redis as IoRedis } from 'ioredis';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class RedisSimpleInterceptor implements NestInterceptor {
    private ioRedis: IoRedis;

    constructor() {
        // 配置你的 Redis 实例
        this.ioRedis = new IoRedis({
            host: 'localhost',  // Redis 的主机地址
            port: 6379,         // Redis 的端口
        });
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        // console.log(request)
        const key = this.generateCacheKey(request);

        return new Observable((observer) => {
            // 首先检查 Redis 中是否有缓存
            this.ioRedis.get(key, (err, cachedData) => {
                if (cachedData) {
                    // 如果缓存命中，返回缓存的数据
                    observer.next(JSON.parse(cachedData));
                    observer.complete();
                } else {
                    // 如果缓存未命中，继续执行后续逻辑
                    next.handle().subscribe((data) => {
                        // 将结果缓存到 Redis
                        // this.redis.setex(key, 60*60, JSON.stringify(data)); // 设置缓存过期时间为1小时
                        this.ioRedis.setex(key, 50, JSON.stringify(data)); // 设置缓存过期时间为1小时
                        observer.next(data);
                        observer.complete();
                    });
                }
            });
        });
    }

    // 用于生成缓存键的辅助函数
    private generateCacheKey(request: any): string {
        console.log('request.originalUrl=', request.originalUrl);
        return `cache:${crypto.createHash('sha256').update(request.originalUrl).digest('hex')}`;
    }
}
