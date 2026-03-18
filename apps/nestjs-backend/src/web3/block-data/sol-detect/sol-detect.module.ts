import { Module } from '@nestjs/common';
import { SolDetectService } from 'src/web3/block-data/sol-detect/sol-detect.service';
import { SolFetchModule } from '../sol-fetch/sol-fetch.module';

@Module({
  imports: [
    SolFetchModule
    // 注意：此模块不引入Redis，由上线调用模块，决定是否缓存、及缓存多久
  ],
  // providers：注册这个模块能“提供”的服务（即 声明我自己拥有这个 service）。
  providers: [SolDetectService],
  // exports：表示这个模块愿意“导出”哪些服务供其他模块使用。
  exports: [SolDetectService],  // 👈 必须导出才能被其它模块注入使用
})
export class SolDetectModule {
}
