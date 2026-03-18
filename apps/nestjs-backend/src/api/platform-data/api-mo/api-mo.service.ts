import { Injectable } from '@nestjs/common';
import { get_MoChainName_To_MoChainId_Map } from 'src/utils/web3';
// import { ConfigService } from '@nestjs/config';
import { AxiosClient } from '@gr/axios-client';
@Injectable()
export class ApiMoService {
    private readonly moAxios: AxiosClient;  //调用mo平台api的axios
    constructor(
    ) {
        //mo平台api的axios的初始化
        const API_MO_KEY = process.env.API_MO_KEY as string;
        this.moAxios = new AxiosClient({
            baseURL: '',    // 不加前缀，使用完整 URL
            headers: {
                accept: "application/json",
                "X-API-Key": API_MO_KEY,
            },
        });
    }//end constructor

    getJsonFromUrl_Mo = async (url: string, errPrint: string): Promise<any> => {
        console.log("getJsonFromUrl_Mo->Fetching from URL:", url);
        try {
            // axios 版
            return this.moAxios.get(url);
        } catch (error) {
            console.error(errPrint, error);
            throw error;
        }
    }
    /* getJsonFromUrl = async (url: string, errPrint: string): Promise<any> => {
        const API_KEY = process.env.API_MO_KEY as string;
        // console.log('API_KEY=', API_KEY)
        console.log("Fetching from URL:", url);

        try {
            const response = await fetch(url, {
                headers: {
                    accept: "application/json",
                    "X-API-Key": API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(errPrint, error);
            throw error;
        }
    } */

    //------------------------------- Token --------------------------------------------------------------

    getTokenPairsFromCa = async (
        chainType: string,
        ca: string,
    ): Promise<any> => {
        const moChainId = get_MoChainName_To_MoChainId_Map(chainType);
        const isSolana = moChainId === "solana";

        let url: string;

        if (isSolana) {
            // Solana endpoint
            url = `https://solana-gateway.moralis.io/token/mainnet/${ca}/pairs`;
        } else {
            // EVM endpoint
            url = `https://deep-index.moralis.io/api/v2.2/erc20/${ca}/pairs?chain=${moChainId}`;
        }

        return this.getJsonFromUrl_Mo(url, "Error fetching getTokenPairsFromCa():");
    }

    getPairTransFromPa = async (
        chainType: string,
        pa: string,
    ): Promise<any> => {
        const chainId = get_MoChainName_To_MoChainId_Map(chainType);
        const isSolana = chainId === "solana";

        let url: string;

        if (isSolana) {
            // Solana endpoint
            // url = `https://solana-gateway.moralis.io/token/mainnet/${ca}/pairs`;
            url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${pa}/swaps?order=DESC`;
        } else {
            // EVM endpoint
            // url = `https://deep-index.moralis.io/api/v2.2/erc20/${ca}/pairs?chain=${chainId}`;
            url = `https://deep-index.moralis.io/api/v2.2/pairs/${pa}/swaps?chain=${chainId}&order=DESC`;
        }

        return this.getJsonFromUrl_Mo(url, "Error fetching getPairTransFromPa():");

    }

    getPairSnipersFromPa = async (
        chainType: string,
        pa: string,
    ): Promise<any> => {
        const chainId = get_MoChainName_To_MoChainId_Map(chainType);
        const isSolana = chainId === "solana";
        const blocksAfterCreation = 1000;
        let url: string;

        if (isSolana) {
            // url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${pa}/swaps?order=DESC`;
            url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${pa}/snipers?blocksAfterCreation=${blocksAfterCreation}`;
        } else {
            // url = `https://deep-index.moralis.io/api/v2.2/pairs/${pa}/swaps?chain=${chainId}&order=DESC`;
            url = `https://deep-index.moralis.io/api/v2.2/pairs/${pa}/snipers?chain=${chainId}&blocksAfterCreation=${blocksAfterCreation}`;
        }

        return this.getJsonFromUrl_Mo(url, "Error fetching getPairSnipersFromPa():");
    }

    getTokenMetaFromCa = async (
        chainType: string,
        ca: string,
    ): Promise<any> => {
        const chainId = get_MoChainName_To_MoChainId_Map(chainType);
        const isSolana = chainId === "solana";

        let url: string;

        if (isSolana) {
            // Solana endpoint
            // url = `https://solana-gateway.moralis.io/token/mainnet/${ca}/pairs`;
            url = `https://solana-gateway.moralis.io/token/mainnet/${ca}/metadata`;

        } else {
            // EVM endpoint
            // url = `https://deep-index.moralis.io/api/v2.2/erc20/${ca}/pairs?chain=${chainId}`;
            url = `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${chainId}&addresses[0]=${ca}`;
        }

        return this.getJsonFromUrl_Mo(url, "Error fetching getTokenMetadataFromCa():");
    }

    getPairStatsFromPa = async (
        chainType: string,
        pa: string,
    ): Promise<any> => {
        const chainId = get_MoChainName_To_MoChainId_Map(chainType);
        const isSolana = chainId === "solana";

        let url: string;

        if (isSolana) {
            // url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${pa}/swaps?order=DESC`;
            url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${pa}/stats`;
        } else {
            // https://deep-index.moralis.io/api/v2.2/pairs/0xcf6daab95c476106eca715d48de4b13287ffdeaa/stats?chain=eth

            url = `https://deep-index.moralis.io/api/v2.2/pairs/${pa}/stats?chain=${chainId}`;
        }

        return this.getJsonFromUrl_Mo(url, "Error fetching getPairStatsFromPa():");
    }

    getTokenHoldersFromCa = async (
        chainType: string,
        ca: string,
    ): Promise<any> => {
        const chainId = get_MoChainName_To_MoChainId_Map(chainType);
        const isSolana = chainId === "solana";

        let url: string;

        //注意：20250408,Mo平台的SOL链的Get Token Holders Api还没开放
        //注意：20250517,Mo平台的SOL链的Get Token Holders Api已经开放
        
        if (isSolana) {
            url = `https://solana-gateway.moralis.io/token/mainnet/${ca}/top-holders?limit=100`;
        } else {
            url = `https://deep-index.moralis.io/api/v2.2/erc20/${ca}/owners?chain=${chainId}&order=DESC`;            
        }

        return this.getJsonFromUrl_Mo(url, "Error fetching getTokenHoldersFromCa():");
    }

    getTokenHolderInsightsFromCa = async (
        chainType: string,
        ca: string,
    ): Promise<any> => {
        const chainId = get_MoChainName_To_MoChainId_Map(chainType);
        const isSolana = chainId === "solana";

        let url: string;

        //注意：20250408,Mo平台的SOL链的 Get Token Holder Stats 已经开放
        // url = `https://deep-index.moralis.io/api/v2.2/erc20/${ca}/owners?chain=${chainId}&order=DESC`;
        if (isSolana) {
            // url = `https://solana-gateway.moralis.io/token/mainnet/${ca}/metadata`;
            url = `https://solana-gateway.moralis.io/token/mainnet/holders/${ca}`;
        } else {
            // url = `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${chainId}&addresses[0]=${ca}`;
            url = `https://deep-index.moralis.io/api/v2.2/erc20/${ca}/holders?chain=${chainId}`;
        }

        return this.getJsonFromUrl_Mo(url, "Error fetching getTokenHolderInsightsFromCa():");
    }

    //------------------------------- Price --------------------------------------------------------------

    getTokenOhlcvFromCa = async (
        chainType: string,
        ca: string,
        timeFrame: string,
        from: string,
        to: string,
    ): Promise<any> => {
        const chainId = get_MoChainName_To_MoChainId_Map(chainType);
        const isSolana = chainId === "solana";

        let url: string;

        //注意：20250408,Mo平台的SOL链的 Get Token Holder Stats 已经开放
        // url = `https://deep-index.moralis.io/api/v2.2/erc20/${ca}/owners?chain=${chainId}&order=DESC`;
        if (isSolana) {
            // url = `https://solana-gateway.moralis.io/token/mainnet/${ca}/metadata`;
            // https://solana-gateway.moralis.io/token/mainnet/pairs/83v8iPyZihDEjDdY8RdZddyZNyUtXngz69Lgo9Kt5d6d/ohlcv?timeframe=1h&currency=usd&fromDate=2024-11-25&toDate=2024-11-26&limit=10
            // 
            url = `https://solana-gateway.moralis.io/token/mainnet/pairs/${ca}/ohlcv?timeframe=${timeFrame}&currency=usd&fromDate=${encodeURIComponent(from)}&toDate=${encodeURIComponent(to)}`;
        } else {
            // https://deep-index.moralis.io/api/v2.2/pairs/0xa43fe16908251ee70ef74718545e4fe6c5ccec9f/ohlcv?chain=eth&timeframe=10min&currency=usd&fromDate=2025-01-01T10%3A00%3A00.000&toDate=2025-01-01T10%3A50%3A00.000
            // 
            url = `https://deep-index.moralis.io/api/v2.2/pairs/${ca}/ohlcv?chain=${chainId}&timeframe=${timeFrame}&currency=usd&fromDate=${encodeURIComponent(from)}&toDate=${encodeURIComponent(to)}`;
        }

        return this.getJsonFromUrl_Mo(url, "Error fetching getTokenOhlcvFromCa():");
    }

    //------------------------------- Pump --------------------------------------------------------------
    getPumpNew = async (
        chainType: string,
        limit: string,
    ): Promise<any> => {
        const chainId = get_MoChainName_To_MoChainId_Map(chainType);
        const isSolana = chainId === "solana";

        let url: string;

        if (isSolana) {
            // Solana endpoint
            // https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/new?limit=100
            url = `https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/new?limit=${limit}`;
        } else {
            // pump暂不支持非 sol 链
            url = ``;
        }

        return this.getJsonFromUrl_Mo(url, "Error fetching getPumpNew():");
    }

    getPumpBonding = async (
        chainType: string,
        limit: string,
    ): Promise<any> => {
        const chainId = get_MoChainName_To_MoChainId_Map(chainType);
        const isSolana = chainId === "solana";

        let url: string;

        if (isSolana) {
            // Solana endpoint
            // https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/bonding?limit=100
            url = `https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/bonding?limit=${limit}`;
        } else {
            // pump暂不支持非 sol 链
            url = ``;
        }

        return this.getJsonFromUrl_Mo(url, "Error fetching getPumpBonding():");
    }

    getPumpGraduated = async (
        chainType: string,
        limit: string,
    ): Promise<any> => {
        const chainId = get_MoChainName_To_MoChainId_Map(chainType);
        const isSolana = chainId === "solana";

        let url: string;

        if (isSolana) {
            // Solana endpoint
            // https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/graduated?limit=100
            url = `https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/graduated?limit=${limit}`;
        } else {
            // pump暂不支持非 sol 链
            url = ``;
        }

        return this.getJsonFromUrl_Mo(url, "Error fetching getPumpGraduated():");
    }
}
