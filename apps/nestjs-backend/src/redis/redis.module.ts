// @@filename(redis-cache.module.ts)
import { Module } from '@nestjs/common'
import { Transport, ClientsModule } from '@nestjs/microservices'
import { Redis as IoRedis } from 'ioredis'
// import { RedisCacheService } from './redis-cache.service'
import { RedisCacheService } from 'src/redis/redis.service'
import { RedisController } from 'src/redis/redis.controller'
import { createRedisConfig } from 'src/redis/redis.config'

@Module({
  imports: [
    // 初始化redis，redis参数建议配置到外部配置文件引入
    // 需要用到：@Inject('MATH_SERVICE') 或 ClientProxy，才需要用：ClientsModule.register(...)
    /* ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.REDIS,
        options: createRedisConfig(), // ✅ 一处定义，多处使用
      }
    ]), */
  ],
  controllers: [RedisController],
  /* 
  错误写法：
  providers: [RedisCacheService, IoRedis],

  这上面一句等价于：
  providers: [
    RedisCacheService,
    {
      provide: IoRedis,
      useClass: IoRedis, // ❌ 会默认执行：new Redis()，连接127.0.0.1:6379
    },
  ]
   */
  providers: [
    RedisCacheService,
    {
      provide: IoRedis,
      useFactory: () => new IoRedis(createRedisConfig()), // ✅ 重用
    },
  ],  

  // exports：表示这个模块愿意“导出”哪些服务供其他模块使用。
  exports: [RedisCacheService, IoRedis],
})

export class RedisCacheModule { }
