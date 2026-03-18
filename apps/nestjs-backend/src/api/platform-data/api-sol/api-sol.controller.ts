import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheTTL } from 'src/redis/decorators';
import { RedisPlusInterceptor } from 'src/redis/interceptors';
import { getApiTTL } from 'src/time/ioredisTtl';
import { ApiSolService } from './api-sol.service';
import { CACHE_KEY_MIDDLE } from 'src/constant/CACHE_KEY';

@UseInterceptors(RedisPlusInterceptor) //ioRedis升级版拦截器.参考：nestjs\cache-manager\interceptors\cache.interceptor.ts写的，使用自定义的redis缓存拦截器。避免使用cache-manager的缓存拦哉器
@CacheTTL(getApiTTL)  // 使用 getDynamicTTL 工具函数动态设置 TTL
@Controller('api-sol')
export class ApiSolController {
    constructor(
        private apiSolService: ApiSolService,
    ) {
    }


    //------------------------------- Token --------------------------------------------------------------
    @Get('sol/token_trans/:ca')
    getTokenTransFromCa(
        @Param('ca') ca: string,
    ) {
        return this.apiSolService.getTokenTransFromCa(ca);
    }

    @Get('sol/token_defi_activity/:ca')
    getTokenDefiActivityFromCa(
        @Param('ca') ca: string,
    ) {
        return this.apiSolService.getTokenDefiActivityFromCa(ca);
    }

    @Get('sol/token_markets/:caArray')
    getTokenMarketsFromCaArray(
        @Param('caArray') caArray: string,
    ) {
        return this.apiSolService.getTokenMarketsFromCaArray(caArray);
    }

    @Get('sol/'+CACHE_KEY_MIDDLE.TOKEN_META+'/:ca')
    getTokenMetaFromCa(
        @Param('ca') ca: string,
    ) {
        return this.apiSolService.getTokenMetaFromCa(ca);
    }

    @Get('sol/'+CACHE_KEY_MIDDLE.TOKEN_META_MULTI+'/:caArray')
    getTokenMetaMultiFromCaArray(
        // 单次api请求最大支持查询：20个地址，用"address[]="分开
        @Param('caArray') caArray: string,
    ) {
        return this.apiSolService.getTokenMetaMultiFromCaArray(caArray);
    }

    @Get('sol/token_price/:ca')
    getTokenPriceFromCa(
        @Param('ca') ca: string,
    ) {
        return this.apiSolService.getTokenPriceFromCa(ca);
    }

    @Get('sol/token_price_multi/:caArray')
    getTokenPriceMultiFromCaArray(
        @Param('caArray') caArray: string,
    ) {
        return this.apiSolService.getTokenPriceMultiFromCaArray(caArray);
    }

    @Get('sol/token_holders/:ca')
    getTokenHoldersFromCa(
        @Param('ca') ca: string,
    ) {
        return this.apiSolService.getTokenHoldersFromCa(ca);
    }

    @Get('sol/token_list/:sortStr')
    getTokenListBySortStr(
        @Param('sortStr') sortStr: string,
    ) {
        // return this.solService.getTokenListBySortStr_v2(sortStr);
        return this.apiSolService.getTokenListBySortStr_v4(sortStr);
    }

    @Get('sol/token_top')
    getTokenTop(
        // @Param('sortStr') sortStr: string,
    ) {
        return this.apiSolService.getTokenTop();
    }

    @Get('sol/token_trending/:limit')
    getTokenTrending(
        @Param('limit') limit: number,
    ) {
        return this.apiSolService.getTokenTrending(limit);
    }

    //------------------------------- Account (Aa) --------------------------------------------------------------
    // account detail
    // 先留空，暂时不到。先不实现：account detail

    // account transfer desc
    @Get('sol/account_trans_desc/:aa')
    getAccountTransDescFromAa(
        @Param('aa') aa: string,
    ) {
        return this.apiSolService.getAccountTransDescFromAa(aa);
    }

    // account transfer asc
    @Get('sol/account_trans_asc/:aa')
    getAccountTransAscFromAa(
        @Param('aa') aa: string,
    ) {
        return this.apiSolService.getAccountTransAscFromAa(aa);
    }

    // account defi activities
    @Get('sol/account_defi_activity/:aa')
    getAccountDefiActivityFromAa(
        @Param('aa') aa: string,
    ) {
        return this.apiSolService.getAccountDefiActivityFromAa(aa);
    }

    // account balance change activities
    @Get('sol/account_balance_change_activity/:aa')
    getAccountBalanceChangeActivityFromAa(
        @Param('aa') aa: string,
    ) {
        return this.apiSolService.getAccountBalanceChangeActivityFromAa(aa);
    }

    // account transactions
    // 先留空，暂时不到。先不实现：account transactions

    // account portfolio
    @Get('sol/account_portfolio/:aa')
    getAccountPortfolioFromAa(
        @Param('aa') aa: string,
    ) {
        return this.apiSolService.getAccountPortfolioFromAa(aa);
    }

    // account token-accounts
    @Get('sol/account_token_accounts/:aa')
    getAccountTokenAccountsFromAa(
        @Param('aa') aa: string,
    ) {
        return this.apiSolService.getAccountTokenAccountsFromAa(aa);
    }

    // account stake
    // 先留空，暂时不到。先不实现：account stake

    // stake rewards export
    // 先留空，暂时不到。先不实现：stake rewards export

    // account transfer export
    @Get('sol/account_trans_export/:aa')
    getAccountTransExportFromAa(
        @Param('aa') aa: string,
    ) {
        // 注意：返回的是。用“,”分隔的text表格，不是json字符串
        return this.apiSolService.getAccountTransExportFromAa(aa);
    }

    // account metadata
    @Get('sol/account_meta/:aa')
    getAccountMetaFromAa(
        @Param('aa') aa: string,
    ) {
        return this.apiSolService.getAccountMetaFromAa(aa);
    }

    //------------------------------- Pool (也叫：Market) --------------------------------------------------------------
    // listing pool/market
    @Get('sol/pool_list/:ca')
    getPoolListFromCa(
        @Param('ca') ca: string,
    ) {
        return this.apiSolService.getPoolListFromCa(ca);
    }

    // get market info
    @Get('sol/pool_info/:pa')
    getPoolInfoFromPa(
        @Param('pa') pa: string,
    ) {
        return this.apiSolService.getPoolInfoFromPa(pa);
    }

    // get market volume
    @Get('sol/pool_vol/:pa')
    getPoolVolFromPa(
        @Param('pa') pa: string,
    ) {
        return this.apiSolService.getPoolVolFromPa(pa);
    }











    // ------------------

}
