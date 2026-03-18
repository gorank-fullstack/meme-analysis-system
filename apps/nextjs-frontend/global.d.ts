// global.d.ts
import type Redis from 'ioredis';

declare global {
  var _redis: Redis | undefined;
}
