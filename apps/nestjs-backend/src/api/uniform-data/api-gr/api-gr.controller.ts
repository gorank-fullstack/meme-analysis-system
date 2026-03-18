import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheTTL } from 'src/redis/decorators';
import { getApiTTL } from 'src/time/ioredisTtl';
import { RedisPlusInterceptor } from 'src/redis/interceptors';
import { ApiGrService } from './api-gr.service';
import {TChainName, TQtType, TTabType_Server} from "@gr/interface-base";

import { CACHE_KEY_MIDDLE } from 'src/constant/CACHE_KEY';
@UseInterceptors(RedisPlusInterceptor) //ioRedis升级版拦截器.参考：nestjs\cache-manager\interceptors\cache.interceptor.ts写的，使用自定义的redis缓存拦截器。避免使用cache-manager的缓存拦哉器
@CacheTTL(getApiTTL)  // 使用 getDynamicTTL 工具函数动态设置 TTL
@Controller('api-gr')
export class ApiGrController {
    constructor(
        private apiGrService: ApiGrService,
    ) {
    }

    //------------------------------- Pools --------------------------------------------------------------
    //获取热门的池子
    @Get(`:chainName/${CACHE_KEY_MIDDLE.TRENDING_POOLS}/:pageStr/:qtType`)
    getTrendingPools(
        @Param('chainName') chainName: TChainName,
        @Param('pageStr') pageStr: string,
        @Param('qtType') qtType: TQtType,
    ) {
        const tabType: TTabType_Server = CACHE_KEY_MIDDLE.TRENDING_POOLS as TTabType_Server;
        return this.apiGrService.getSelPools(chainName, tabType, pageStr, qtType);
        
    }

    //获取最新的池子
    @Get(`:chainName/${CACHE_KEY_MIDDLE.NEW_POOLS}/:pageStr`)
    getNewPools(
        @Param('chainName') chainName: TChainName,
        @Param('pageStr') pageStr: string,
        @Param('qtType') qtType: TQtType,        
    ) {
        const tabType: TTabType_Server = CACHE_KEY_MIDDLE.NEW_POOLS as TTabType_Server;
        // const duration:string="trending_pools";
        return this.apiGrService.getSelPools(chainName, tabType, pageStr, qtType);
    }
}
