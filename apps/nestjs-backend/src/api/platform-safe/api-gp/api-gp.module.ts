import { Module } from '@nestjs/common';
import { ApiGpController } from './api-gp.controller';
import { ApiGpService } from './api-gp.service';
import { Transport, ClientsModule } from '@nestjs/microservices'
import { Redis as IoRedis } from 'ioredis'
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
  imports: [
    // 初始化redis，redis参数建议配置到外部配置文件引入
    /* ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.REDIS,
        options: {
          // host: process.env.REDIS_URL as string,
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          password: process.env.REDIS_PASSWORD,
        },
      }
    ]), */
    // 引入RedisCacheModule模块
    RedisCacheModule, 
  ],
  controllers: [ApiGpController],
  // providers: [ApiGpService, IoRedis]
  providers: [ApiGpService]
})
export class ApiGpModule { }
