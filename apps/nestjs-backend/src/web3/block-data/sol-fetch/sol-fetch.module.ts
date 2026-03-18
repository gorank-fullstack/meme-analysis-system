import { Module } from '@nestjs/common';
import { SolFetchService } from 'src/web3/block-data/sol-fetch/sol-fetch.service';
import { SolConnModule } from 'src/web3/block-conn/sol-conn/sol-conn.module';

@Module({
  imports: [SolConnModule],
  // providers：注册这个模块能“提供”的服务（即 声明我自己拥有这个 service）。
  providers: [SolFetchService],
  // exports：表示这个模块愿意“导出”哪些服务供其他模块使用。
  exports: [SolFetchService],  // 👈 必须导出才能被其它模块注入使用
})
export class SolFetchModule {}
