import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheTTL } from 'src/redis/decorators';
import { getApiTTL } from 'src/time/ioredisTtl';
import { RedisPlusInterceptor } from 'src/redis/interceptors';
import {TaskGrService} from 'src/task/uniform-data/task-gr/task-gr.service'
import { CACHE_KEY_MIDDLE } from 'src/constant/CACHE_KEY';
import { isTChainName, isTQtType, TChainName, TQtType } from '@gr/interface-base';

// 注意：task-gr模块，坊取的数据，都是由task定时任务访问api然后存到：永不过期的redis缓存中的
@UseInterceptors(RedisPlusInterceptor) //ioRedis升级版拦截器.参考：nestjs\cache-manager\interceptors\cache.interceptor.ts写的，使用自定义的redis缓存拦截器。避免使用cache-manager的缓存拦哉器
@CacheTTL(getApiTTL)  // 使用 getDynamicTTL 工具函数动态设置 TTL
@Controller('task-gr')
export class TaskGrController {
    constructor(
        private taskGrService: TaskGrService,
    ) {
    }

    // 不带'duration'参数时，是返回：1h_6h的合并结果
    /* @Get(`:chainType/${CACHE_KEY_MIDDLE.TRENDING_POOLS}`)
    getTrendingPools_1h_And_6h(
        @Param('chainType') chainType: string,        
        // @Param('duration') duration: string,
    ) {
        return this.taskGrService.getTrendingPools_1h_And_6h(chainType);
    } */

    //duration是：5m/1h/6h/24h 值中的一个
    // @Get(`:chainType/${CACHE_KEY_MIDDLE.TRENDING_POOLS}/:duration`)
    @Get(`:chainType/${CACHE_KEY_MIDDLE.TRENDING_POOLS}_:duration/:pageStr`)
    getTrendingPools(
        @Param('chainType') chainTypeRaw: string,        
        @Param('duration') durationRaw: string,
        @Param('pageStr') pageStr: string,
    ) {
        const chainName: TChainName = isTChainName(chainTypeRaw) ? chainTypeRaw : 'sol';
        const duration: TQtType = isTQtType(durationRaw) ? durationRaw : '5m';
        // const tabType: TTabType = CACHE_KEY_MIDDLE.TRENDING_POOLS as TTabType;
        return this.taskGrService.getTrendingPools_v2(chainName, duration, pageStr);
    }

    // @Get(`:chainType/${CACHE_KEY_MIDDLE.NEW_POOLS}`)
    @Get(`:chainType/${CACHE_KEY_MIDDLE.NEW_POOLS}_:duration/:pageStr`)
    getNewPools(
        @Param('chainType') chainTypeRaw: string,        
        @Param('duration') durationRaw: string,
        @Param('pageStr') pageStr: string,
    ) {
        const chainName: TChainName = isTChainName(chainTypeRaw) ? chainTypeRaw : 'sol';
        const duration: TQtType = isTQtType(durationRaw) ? durationRaw : '5m';
        
        return "";
        // return this.taskGrService.getNewPools_v1(chainType, duration, pageStr);
    }
}
