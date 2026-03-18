/* 
sol-conn 模块
    定位：提供一个全局可注入的 Connection 实例
    （类似 Redis 模块提供 IoRedis 实例,
    参考：src/redis/redis.module.ts
    ）。

特点：
    模块只关心连接初始化，不关心业务。
    提供的 Connection 可以被任意其他模块 @Inject(Connection) 注入使用。
 */

// src/web3/block-conn/sol-conn/sol-conn.module.ts
import { Module } from '@nestjs/common';
import { Connection } from '@solana/web3.js';
import { ConfigService } from '@nestjs/config';
@Module({
    providers: [
        {
          provide: Connection,
          useFactory: (cs: ConfigService) => 
            new Connection(cs.get<string>('SOL_RPC_URL')!, 'confirmed'),
          inject: [ConfigService],
        },
      ],
      // exports：表示这个模块愿意“导出”哪些服务供其他模块使用。
      exports: [Connection],
})
export class SolConnModule {}
