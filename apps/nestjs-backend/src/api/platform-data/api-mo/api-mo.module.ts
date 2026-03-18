import { Module } from '@nestjs/common';
import { ApiMoController } from './api-mo.controller';
import { ApiMoService } from './api-mo.service';
import { ConfigModule } from '@nestjs/config';
import { Transport, ClientsModule } from '@nestjs/microservices'
import { Redis as IoRedis } from 'ioredis'
import { RedisCacheModule } from 'src/redis/redis.module';
@Module({
  /* imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使配置全局可用
      envFilePath: '.env', // 默认就是 .env，可以省略
    }),

  ], */
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
  controllers: [ApiMoController],
  // providers: [ApiMoService, IoRedis],
  providers: [ApiMoService],
})
export class ApiMoModule { }
