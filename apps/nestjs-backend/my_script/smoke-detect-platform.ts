// CLI
// pnpm ts-node -r dotenv/config my_script/smoke-detect-platform.ts

/* eslint-disable no-console */
import 'dotenv/config';
// import assert from 'node:assert';

// 顶部加这一行（2 选 1）
// import assert from "node:assert/strict";
import * as assert from "node:assert/strict";
import { detectLaunchPlatform } from '../src/utils/api/platform-data/api-sol_trans';
import type { IDataItemRaw } from '@gr/interface-api/platform-data';

const TXS = [
    // 你给的这笔 pump 发射交易：

    // '3QPiKofhSwixkMR3MmgmNk8mjH9myNmw8GBpMcKtoyE1wrioLYDGwNMCxcjm8HsUGA8ADfh1rU7GiJiFDkk6SM79',
    // 也可随手再加几笔别的 tx 做对照
    // "4iyLmUk1eu4jDEiLVyoH2frnr6icHLkHdWJhcdPSf8LGEKvJVS6tWSQKUhV3TDWweUu7ve2SCq1Xt8rFh8ZWcntT",
    // "4nrSS7AZG1kLrbvopvvXvxQcddxvYRsN8jTwSH1ds6yzW9iuLpx5SnDk1CcYyeP5bk1BhtPUfwtq9BwvqUPjm6iE",
    "3oRa2F3h3YjFCCypBvcaEbNem2Lkejg4avwGhH44cC6zTFbyTBtLsYyBWH5n5avBcMdcKBRSLyeTWXdV8SZ4tnk7",
    "4Z8DpHBUQ21yZaV4CzmRMPKEnE2oqX1ttwZvxQtejaQsiiwqwHd1gc3fs7cenX35q9a8oKEGUTY22ekkrkkuyJC7",
    "4FGYBLqJWVDL5DeYd86ktqz5WucPK2rpuJpat3vK9xBEnoP7nYnZKe3KsRgnpNo4He37eeCaaEty21F23gSVuQ3W",
    "23rya4AxsprLKijuyNaFC4UzKabgfXrpKPdmD5YfrnRA1RNSkE9wfzbhFUuJVG5MbwNjoCxYhGU1bypikn9YDdwi",  //token非bonk结尾，但是bonk发射的
    "T7Pho4QA6LgTD2ziKmcGCeGKZYuYitDhEyoVdAi1r97P4PH4UYFiveTUtqaGXLSA4BiPTQfDLXjUziwszYv4C5m",

    // 'xxxxxx',
];

const API = 'https://pro-api.solscan.io/v2.0/transaction/detail/multi';
// const SOLSCAN_TOKEN = process.env.API_SOL_KEY!;
const SOLSCAN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDQxOTAwNTM2MzksImVtYWlsIjoiZ29yYW5rMTAyNEBnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3NDQxOTAwNTN9.KQczx2kVcDB0aWH6yXZoRXTM1H3Vu8vJAZsyh-jjFiw";

async function fetchTx(tx: string) {
    const url = `${API}?tx[]=${encodeURIComponent(tx)}`;
    const res = await fetch(url, {
        method: 'GET',
        headers: { token: SOLSCAN_TOKEN },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Solscan HTTP ${res.status}: ${text}`);
    }
    const json = await res.json();
    // 返回结构：{ success, data: [ {...}, {...} ] }
    if (!json?.success) throw new Error(`Solscan response not success: ${JSON.stringify(json)}`);
    const [item] = json.data ?? [];
    if (!item) throw new Error('Empty data array');
    return item as IDataItemRaw; // 你的接口基本对齐 solscan 的字段
}


async function main() {
    const query = TXS.map(t => `tx[]=${t}`).join("&");
    const url = `https://pro-api.solscan.io/v2.0/transaction/detail/multi?${query}`;
  
    const res = await fetch(url, { headers: { token: SOLSCAN_TOKEN } });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
  
    const json = await res.json();
    const items: IDataItemRaw[] = json?.data ?? [];
    if (!Array.isArray(items)) throw new Error("Unexpected API format");
  
    for (const tx of items) {
      const detected = detectLaunchPlatform(tx);
      console.log(`[tx=${tx.tx_hash}] -> ${detected}`);
    }
  }
  
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });
