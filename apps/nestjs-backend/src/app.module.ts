import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
// import { RedisModule } from './redis/redis.module';
import { RedisCacheModule } from 'src/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { TaskGrService } from './task/uniform-data/task-gr/task-gr.service';
import { ApiMoModule } from 'src/api/platform-data/api-mo/api-mo.module';
import { ApiSolModule } from 'src/api/platform-data/api-sol/api-sol.module';
import { ApiCgModule } from 'src/api/platform-data/api-cg/api-cg.module';
import { ApiGrModule } from 'src/api/uniform-data/api-gr/api-gr.module';
import { ApiGpModule } from 'src/api/platform-safe/api-gp/api-gp.module';
// import { TaskGrController } from './task/uniform-data/task-gr/task-gr.controller';
import { TaskGrModule } from 'src/task/uniform-data/task-gr/task-gr.module';
import { SortHotModule } from 'src/sort/uniform-data/sort-hot/sort-hot.module';
import { SortNewModule } from 'src/sort/uniform-data/sort-new/sort-new.module';
import { SolFetchModule } from 'src/web3/block-data/sol-fetch/sol-fetch.module';
import { SolDetectModule } from 'src/web3/block-data/sol-detect/sol-detect.module';
import { SolConnModule } from 'src/web3/block-conn/sol-conn/sol-conn.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使配置全局可用
      // envFilePath: '.env', // 旧的:默认就是 .env，可以省略
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    // 导入Redis模块
    RedisCacheModule,
    ScheduleModule.forRoot(), //激活Task scheduling (除了:@Cron()装饰器,还能使用:@Interval(N * 1000)装饰器)

    ApiMoModule,
    ApiSolModule,
    ApiCgModule,
    ApiGrModule,
    ApiGpModule,

    TaskGrModule,
    SortHotModule,
    SortNewModule,
    SolFetchModule,
    SolDetectModule,
    SolConnModule,
  ],
  // controllers: [AppController, TaskGrController],
  controllers: [AppController],
  providers: [
    AppService,
    // TaskGrService,  //启用：TaskGrService
  ],
})
export class AppModule {}
