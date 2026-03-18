// 纯抓取/工具：rpc 连接、交易获取、地址解析等
import { Injectable } from "@nestjs/common";
import { Connection, PublicKey } from "@solana/web3.js";
import type { VersionedTransactionResponse } from "@solana/web3.js";
import {TPlatformType} from "@gr/interface-base";
// export type TPlatform = "pump" | "bonk";

/* export interface NormalizeResult {
    mint: string;               // 纯 mint（去掉后缀或直接是合法 mint）
    platform: TPlatform | null; // pump / bonk / null
}
 */
@Injectable()
export class SolFetchService {
    constructor(private readonly conn: Connection) { }

    /** 只判断 Solana 合约地址是否以 pump/bonk 结尾（大小写不敏感） */
    getPlatformSuffix(addr: string): TPlatformType | null {
        const lower = (addr || "").toLowerCase();
        if (lower.endsWith("pump")) return "pump";
        if (lower.endsWith("bonk")) return "bonk";
        return null;
    }

    /** 拉一笔交易（未解析，带 meta），失败返回 null */
    async getTx(sig: string): Promise<VersionedTransactionResponse | null> {
        try {
            return await this.conn.getTransaction(sig, { maxSupportedTransactionVersion: 0 });
        } catch {
            return null;
        }
    }

    /** 取某 mint 最早若干签名（备用） */
    async getEarliestSignatures(mint: string, limit = 40) {
        try {
            const pub = new PublicKey(mint);
            const sigs = await this.conn.getSignaturesForAddress(pub, { limit }, "confirmed");
            return [...sigs].sort((a, b) => (a.blockTime ?? 0) - (b.blockTime ?? 0));
        } catch {
            return [];
        }
    }
}
