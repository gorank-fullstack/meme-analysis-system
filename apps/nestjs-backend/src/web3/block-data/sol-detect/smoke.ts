// src/web3/block-data/sol-detect/smoke.ts
/*
  冒烟测试脚本：SolDetectService.verifyLaunchByCreateTx()
  用法：
    SOL_RPC_URL=https://api.mainnet-beta.solana.com \
    ts-node -r tsconfig-paths/register src/web3/block-data/sol-detect/smoke.ts \
      <createTx签名> <platform>

  例：
    ts-node -r tsconfig-paths/register src/web3/block-data/sol-detect/smoke.ts \
      5X...你的签名...Q1 pump
*/

import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
// import yargs from 'yargs';
// import { hideBin } from 'yargs/helpers';

import { SolConnModule } from 'src/web3/block-conn/sol-conn/sol-conn.module'; // 你的 SolConnModule
import { SolFetchService } from 'src/web3/block-data/sol-fetch/sol-fetch.service';
import { SolDetectService } from 'src/web3/block-data/sol-detect/sol-detect.service';
import type { TPlatformType } from '@gr/interface-base';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), SolConnModule],
    providers: [SolFetchService, SolDetectService],
  })
  class SmokeModule {}
  
  async function main() {
    const args = process.argv.slice(2); // 去掉 node 和脚本路径
    if (args.length < 2) {
      console.error('用法: ts-node smoke.ts <createTx签名> <platform>');
      console.error('platform 可选值: pump | bonk');
      process.exit(1);
    }
  
    const createTx = args[0];
    const platform = args[1] as TPlatformType;
  
    if (!['pump', 'bonk'].includes(platform)) {
      console.error(`platform 必须是 "pump" 或 "bonk"，当前为: ${platform}`);
      process.exit(1);
    }
  
    const app = await NestFactory.createApplicationContext(SmokeModule, {
      logger: ['error', 'warn', 'log'],
    });
  
    try {
      const detector = app.get(SolDetectService);
      const { state, reason } = await detector.verifyLaunchByCreateTx(createTx, platform);
      console.log(JSON.stringify({ tx: createTx, platform, state, reason }, null, 2));
    } finally {
      await app.close();
    }
  }
  
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });