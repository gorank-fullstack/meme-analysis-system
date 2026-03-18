import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheTTL } from 'src/redis/decorators';
import { getApiTTL } from 'src/time/ioredisTtl';
import { RedisPlusInterceptor } from 'src/redis/interceptors';
import { ApiGpService } from './api-gp.service';
@UseInterceptors(RedisPlusInterceptor) //ioRedis升级版拦截器.参考：nestjs\cache-manager\interceptors\cache.interceptor.ts写的，使用自定义的redis缓存拦截器。避免使用cache-manager的缓存拦哉器
@CacheTTL(getApiTTL)  // 使用 getDynamicTTL 工具函数动态设置 TTL
@Controller('api-gp')
export class ApiGpController {
    constructor(
        private apiGpService: ApiGpService,
    ) {
    }

    // Get token's security and risk data.
    @Get(':chainType/token_security/:caArray')
    getTokenSecurityFromCaArray(
        @Param('chainType') chainType: string,
        @Param('caArray') caArray: string,
    ) {
        // return this.gpService.getTokenSecurityFromCaArray_UseGoPlus(chainType, caArray);
        return this.apiGpService.getTokenSecurityFromCaArray_UseUrl(chainType, caArray);        
    }
}
