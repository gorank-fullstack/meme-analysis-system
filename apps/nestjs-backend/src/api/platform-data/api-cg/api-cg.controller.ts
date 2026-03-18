import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheTTL } from 'src/redis/decorators';
import { getApiTTL } from 'src/time/ioredisTtl';
import { RedisPlusInterceptor } from 'src/redis/interceptors';
import { ApiCgService } from './api-cg.service';
import { CACHE_KEY_MIDDLE } from 'src/constant/CACHE_KEY';

@UseInterceptors(RedisPlusInterceptor) //ioRedis升级版拦截器.参考：nestjs\cache-manager\interceptors\cache.interceptor.ts写的，使用自定义的redis缓存拦截器。避免使用cache-manager的缓存拦哉器
@CacheTTL(getApiTTL)  // 使用 getDynamicTTL 工具函数动态设置 TTL
@Controller('api-cg')
export class ApiCgController {
    constructor(
        private apiCgService: ApiCgService,
    ) {
    }

    //------------------------------- Pools --------------------------------------------------------------
    //获取热门的池子
    @Get(`:chainType/${CACHE_KEY_MIDDLE.TRENDING_POOLS}/:duration`)
    getTrendingPools(
        @Param('chainType') chainType: string,
        @Param('duration') duration: string,
    ) {
        return this.apiCgService.getTrendingPools(chainType, duration);
    }

    //获取最新的池子
    @Get(`:chainType/${CACHE_KEY_MIDDLE.NEW_POOLS}`)
    getNewPools(
        @Param('chainType') chainType: string,
        // @Param('duration') duration: string,
    ) {
        return this.apiCgService.getNewPools(chainType);
    }

    //通过 pa(池子地址，获取：池子信息)
    @Get(':chainType/pools/:pa')
    getPoolsFromPa(
        @Param('chainType') chainType: string,
        @Param('pa') pa: string,
    ) {
        return this.apiCgService.getPoolsFromPa(chainType, pa);
    }

    //通过 paArray(池子地址列表，获取：多个池子信息)
    @Get(':chainType/pools_multi/:paArray')
    getPoolsMultiFromPaArray(
        @Param('chainType') chainType: string,
        @Param('paArray') paArray: string,
    ) {
        return this.apiCgService.getPoolsMultiFromPaArray(chainType, paArray);
    }
    
    //------------------------------- Tokens --------------------------------------------------------------
    //通过 ca(合约地址，获取：Token媒体信息)
    @Get(':chainType/'+CACHE_KEY_MIDDLE.TOKEN_META+'/:ca')
    getTokenMetaFromCa(
        @Param('chainType') chainType: string,
        @Param('ca') ca: string,
    ) {
        return this.apiCgService.getTokenMetaFromCa(chainType, ca);
    }

    //通过 caArray(合约地址列表，获取：多个Token媒体信息)
    @Get(':chainType/'+CACHE_KEY_MIDDLE.TOKEN_META_MULTI+'/:caArray')
    getTokenMetaMultiFromCaArray(
        @Param('chainType') chainType: string,
        @Param('caArray') caArray: string,
    ) {
        return this.apiCgService.getTokenMetaMultiFromCaArray(chainType, caArray);
    }
}
