import type { Message } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { redis, redisKey } from '@/lib/redis';

const RECENT_MESSAGES_TTL_SECONDS = 60;

type CachedMessage = Omit<Message, 'createdAt'> & { createdAt: string };

function hydrateCachedMessages(messages: CachedMessage[]): Message[] {
  return messages.map((message) => ({
    ...message,
    createdAt: new Date(message.createdAt)
  }));
}

export async function getRecentMessages(recipientEmail: string): Promise<Message[]> {
  const cacheKey = redisKey(['messages', 'recent', recipientEmail]);

  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as CachedMessage[];
      return hydrateCachedMessages(parsed);
    }
  }

  const messages = await prisma.message.findMany({
    where: { recipientEmail },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  if (redis) {
    const payload: CachedMessage[] = messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString()
    }));

    await redis.set(cacheKey, JSON.stringify(payload), 'EX', RECENT_MESSAGES_TTL_SECONDS);
  }

  return messages;
}

export async function invalidateRecentMessages(recipientEmail: string) {
  if (!redis) {
    return;
  }

  const cacheKey = redisKey(['messages', 'recent', recipientEmail]);
  await redis.del(cacheKey);
}
