import Redis from 'ioredis';

declare global {
  // eslint-disable-next-line no-var
  var _redisClient: Redis | null | undefined;
}

const redisUrl = process.env.REDIS_URL;

const redisClient =
  redisUrl !== undefined && redisUrl.length > 0
    ? globalThis._redisClient ?? new Redis(redisUrl, { enableAutoPipelining: true })
    : null;

if (redisClient && process.env.NODE_ENV !== 'production') {
  globalThis._redisClient = redisClient;
}

export const redis = redisClient;

export function redisKey(parts: string[]) {
  return parts.join(':');
}
