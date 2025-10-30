import { Redis } from '@upstash/redis';

declare global {
  // eslint-disable-next-line no-var
  var _upstashRedis: Redis | null | undefined;
}

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redisClient =
  redisUrl && redisToken
    ? globalThis._upstashRedis ?? new Redis({
        url: redisUrl,
        token: redisToken
      })
    : null;

if (redisClient && process.env.NODE_ENV !== 'production') {
  globalThis._upstashRedis = redisClient;
}

export const redis = redisClient;

export function redisKey(parts: string[]) {
  return parts.join(':');
}
