import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiMoService } from './api-mo.service';
import { CacheTTL } from 'src/redis/decorators';
import { getApiTTL } from 'src/time/ioredisTtl';
import { RedisPlusInterceptor } from 'src/redis/interceptors';
import { CACHE_KEY_MIDDLE } from 'src/constant/CACHE_KEY';

@UseInterceptors(RedisPlusInterceptor) //ioRedis升级版拦截器.参考：nestjs\cache-manager\interceptors\cache.interceptor.ts写的，使用自定义的redis缓存拦截器。避免使用cache-manager的缓存拦哉器
@CacheTTL(getApiTTL)  // 使用 getDynamicTTL 工具函数动态设置 TTL
@Controller('api-mo')
export class ApiMoController {

    constructor(
        private apiMoService: ApiMoService,
    ) {
    }

    //------------------------------- Token --------------------------------------------------------------

    //通过 ca(合约地址，获取：池子列表)
    @Get(':chainType/token_pairs/:ca')
    getTokenPairsFromCa(
        @Param('chainType') chainType: string,
        @Param('ca') ca: string,
    ) {
        return this.apiMoService.getTokenPairsFromCa(chainType, ca);
    }

    //通过 pa(池子地址，获取：交易列表)
    @Get(':chainType/pair_trans/:pa')
    getPairTransFromPa(
        @Param('chainType') chainType: string,
        @Param('pa') pa: string,
    ) {
        return this.apiMoService.getPairTransFromPa(chainType, pa);
    }

    //通过 pa(池子地址，获取：狙击手列表)
    @Get(':chainType/pair_snipers/:pa')
    getPairSnipersFromPa(
        @Param('chainType') chainType: string,
        @Param('pa') pa: string,
    ) {
        return this.apiMoService.getPairSnipersFromPa(chainType, pa);
    }

    //通过 ca(合约地址，获取：Token媒体信息)
    @Get(':chainType/'+CACHE_KEY_MIDDLE.TOKEN_META+'/:ca')
    getTokenMetaFromCa(
        @Param('chainType') chainType: string,
        @Param('ca') ca: string,
    ) {
        return this.apiMoService.getTokenMetaFromCa(chainType, ca);
    }

    //通过 pa(池子地址，获取：池子状态)
    @Get(':chainType/pair_stats/:pa')
    getPairStatsFromPa(
        @Param('chainType') chainType: string,
        @Param('pa') pa: string,
    ) {
        return this.apiMoService.getPairStatsFromPa(chainType, pa);
    }

    //通过 ca(合约地址，获取：Token持币列表)
    @Get(':chainType/token_holders/:ca')
    getTokenHoldersFromCa(
        @Param('chainType') chainType: string,
        @Param('ca') ca: string,
    ) {
        return this.apiMoService.getTokenHoldersFromCa(chainType, ca);
    }

    //通过 ca(合约地址，获取：Token持币分析)
    @Get(':chainType/token_holder_insights/:ca')
    getTokenHolderInsightsFromCa(
        @Param('chainType') chainType: string,
        @Param('ca') ca: string,
    ) {
        return this.apiMoService.getTokenHolderInsightsFromCa(chainType, ca);
    }

    //------------------------------- Price --------------------------------------------------------------
    
    //通过 ca(合约地址，获取：Token OHLCV数据)
    @Get(':chainType/token_ohlcv/:ca/:timeFrame/:from/:to')
    getTokenOhlcvFromCa(
        @Param('chainType') chainType: string,
        @Param('ca') ca: string,
        @Param('timeFrame') timeFrame: string,
        @Param('from') from: string,
        @Param('to') to: string,
    ) {
        return this.apiMoService.getTokenOhlcvFromCa(chainType, ca, timeFrame, from, to);
    }

    //------------------------------- Pump --------------------------------------------------------------
    @Get(':chainType/pump_new/:limit')
    getPumpNew(
        @Param('chainType') chainType: string,
        @Param('limit') limit: string,
    ){
        return this.apiMoService.getPumpNew(chainType, limit);
    }

    @Get(':chainType/pump_bonding/:limit')
    getPumpBonding(
        @Param('chainType') chainType: string,
        @Param('limit') limit: string,
    ){
        return this.apiMoService.getPumpBonding(chainType, limit);
    }

    @Get(':chainType/pump_graduated/:limit')
    getPumpGraduated(
        @Param('chainType') chainType: string,
        @Param('limit') limit: string,
    ){
        return this.apiMoService.getPumpGraduated(chainType, limit);
    }

}

