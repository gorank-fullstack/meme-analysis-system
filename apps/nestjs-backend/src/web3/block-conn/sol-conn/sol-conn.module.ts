// src/web3/block-conn/sol-conn/sol-conn.module.ts
/* 
    模块名称：SolConnModule
    功能定位：
        提供一个全局可注入的 Solana Connection 实例（类似 Redis 模块提供 IoRedis 实例）。
        支持从环境变量 SOL_RPC_URL 读取 RPC 端点，如果未设置则自动回退到官方公共节点。
        仅负责连接初始化，不处理任何业务逻辑。
    
    特点：
        - 可通过 @Inject(Connection) 在任意模块中注入使用
        - 支持 ConfigService 从 .env 读取配置
        - 默认回退到 clusterApiUrl('mainnet-beta')（官方公共节点）
        - 要求 RPC URL 必须以 http:// 或 https:// 开头
        - 如果填写 wss:// 会抛出异常（web3.js 初始化不支持直接用 ws(s) 协议）

    注意：
        - 官方公共节点 https://api.mainnet-beta.solana.com 免费，但有频率限制且无 SLA，不适合高并发生产环境
        - 生产环境建议使用付费 RPC（Helius、QuickNode、Triton 等）或自建节点
*/

// src/web3/block-conn/sol-conn/sol-conn.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection, clusterApiUrl, type Cluster } from '@solana/web3.js';

function pickEndpoint(cs: ConfigService): string {
  const rawSolRpc = cs.get<string>('SOL_RPC_URL')?.trim();
  if (rawSolRpc) {
    if (rawSolRpc.startsWith('http://') || rawSolRpc.startsWith('https://')) {
      return rawSolRpc;
    }
    if (rawSolRpc.startsWith('ws://') || rawSolRpc.startsWith('wss://')) {
      // web3.js 初始化必须 http(s)，它会自己派生 ws(s) 连接
      throw new TypeError(
        'SOL_RPC_URL must start with http:// or https:// (not ws:// or wss://). ' +
        'Use the HTTP endpoint of your RPC provider.'
      );
    }
    throw new TypeError('SOL_RPC_URL is set but not a valid http(s) URL.');
  }

  // 未设置 SOL_RPC_URL 时，按网络名回退
  const net = (cs.get<string>('SOL_NETWORK') ?? 'mainnet-beta') as Cluster;

  // 没配 SOL_RPC_URL:就调用 clusterApiUrl(net) → 返回对应官方公共 RPC
  // clusterApiUrl(net) 是 @solana/web3.js 自带的一个小工具函数，
  // 作用就是：根据你传入的网络名（devnet / testnet / mainnet-beta），
  return clusterApiUrl(net);
}

@Module({
  // 如果你已经在 AppModule 里 ConfigModule.forRoot({ isGlobal: true }) 了，
  // 这里的 imports 可以省略；否则保留这行保证可注入。
  imports: [ConfigModule],
  providers: [
    {
      provide: Connection,
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => {
        const endpoint = pickEndpoint(cs);
        // 也可以传 options 对象；这里保持简洁
        return new Connection(endpoint, 'confirmed');
      },
    },
  ],
  // exports：表示这个模块愿意“导出”哪些服务供其他模块使用。
  exports: [Connection],
})
export class SolConnModule {}
