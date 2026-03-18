import { IMoEvmTokenPair ,IMoSplTokenPair} from "@gr/interface-api/platform-data";


export interface ITrans {
    transactionHash?: string;
    transactionIndex?: number;
    // transactionHash: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // 可根据具体结构扩展字段
}

export interface ITokenInfo {
    address: string;
    name?: string;
    symbol?: string;
    decimals?: number;
}

export interface IPairData {
    baseToken: ITokenInfo | null;
    quoteToken: ITokenInfo | null;
    pairLabel: string | null;
}

// 返回的结构，包含数值和代币符号
export interface ITokenValue {
    value: number;
    symbol: string;
  }

/* interface TransactionResult {
    // 根据实际返回结构定义字段
    [key: string]: any;
} */

export interface IApiResponse {
    baseToken?: ITokenInfo;
    quoteToken?: ITokenInfo;
    pairLabel?: string;
    // result?: TransactionResult[];
    result?: ITrans[];
    cursor?: string;
}

export interface ISplTokenTransProps {
    /* pair: {
        pairAddress: string;
        baseToken: string;
        quoteToken: string;
        // [key: string]: any; // 如果 pair 对象还有其他字段，可扩展
    }; */
    tokenPair:IMoSplTokenPair;
    // chainId: string | number;
    chainId: string;
}

export interface IEvmTokenTransProps {
    /* pair: {
        pair_address: string;
        base_token: string;
        quote_token: string;
        // [key: string]: any; // 如果 pair 对象还有其他字段，可扩展
    }; */
    tokenPair:IMoEvmTokenPair;
    // pair: IMoEvmPair[]; // token0 和 token1 的信息
    // chainId: string | number;
    chainId: string;
}

export interface ITokenPaProps {
    pa:string;
    // chainId: string | number;
    chainId: string;
}

export interface ITokenCaProps {
    ca: string;
    // chainId: string | number;
    chainId: string;
}

// 用于格式化文本及其颜色显示
export interface ITextWithColor {
    text: string;
    color: string;
  }