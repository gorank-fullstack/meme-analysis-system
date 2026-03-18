// import { MODULE_OPTIONS_TOKEN } from './cache.module-definition';

// export const CACHE_MANAGER = 'CACHE_MANAGER';
/* export const CACHE_KEY_METADATA = 'cache_module:cache_key';
export const CACHE_TTL_METADATA = 'cache_module:cache_ttl'; */
export const CACHE_KEY_METADATA = 'ioredis:cache_key';
export const CACHE_TTL_METADATA = 'ioredis:cache_ttl';

// 可选：防穿透的未命中占位
// export const MISS = '__MISS__';
// export const CACHE_MODULE_OPTIONS = MODULE_OPTIONS_TOKEN;