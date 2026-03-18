import { Module } from '@nestjs/common';
import { TaskGrController } from 'src/task/uniform-data/task-gr/task-gr.controller'
import { TaskGrService } from 'src/task/uniform-data/task-gr/task-gr.service'
// import { ApiGrService } from 'src/api/uniform-data/api-gr/api-gr.service'
// import { SortHotService } from 'src/sort/uniform-data/sort-hot/sort-hot.service';

// import { Transport, ClientsModule } from '@nestjs/microservices'
// import { Redis as IoRedis } from 'ioredis'
import { SortHotModule } from 'src/sort/uniform-data/sort-hot/sort-hot.module';
import { ApiGrModule } from 'src/api/uniform-data/api-gr/api-gr.module';
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
                    // url: process.env.REDIS_URL as string,
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT || '6379', 10),
                    password: process.env.REDIS_PASSWORD,
                },
            },
        ]), */
        // 引入RedisCacheModule模块
        RedisCacheModule, 
        // 引入ApiGrModule、SortHotModule模块
        ApiGrModule,
        SortHotModule,
    ],
    controllers: [TaskGrController],
    // providers: [TaskGrService, IoRedis],
    providers: [TaskGrService],
    // providers: [TaskGrService, IoRedis, ApiGrService]
    //重要知识点一：在：TaskGrService 引用 SortHotService 的两种方法【推荐使用方法一：更规范】
    //方法一：需改两处：（原先的推荐使用，20250627：改为：必须使用方法一。）
    // 修改 1: 修改　sort-hot.module.ts 文件
    // 在：exports: []数组里，添加：SortHotService,  // 👈 必须导出才能被其它模块注入使用

    // 修改 2: 修改 task-gr.module.ts 文件
    // 在imports: []数组里，添加：SortHotModule

    //　（已经放弃使用）方法二：仅改一处：(原先的不建议和。20250627：改为：放弃使用方法二[会造成多次实例的问题]、快速测试)
    //注意：使用方法二，还有一个问题。多次实例化的问题
    // 修改：task-gr.module.ts 文件
    // 在providers: []数组里，添加：SortHotService
})
export class TaskGrModule { }
