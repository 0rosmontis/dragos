'use server';

import { z } from 'zod';

import { prisma } from '@/lib/prisma';

const sendMessageSchema = z.object({
  recipientEmail: z.string().email('Please enter a valid recipient email'),
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Messages are limited to 1000 characters')
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export async function sendMessageAction(input: SendMessageInput) {
  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid input'
    } as const;
  }

  await prisma.message.create({
    data: {
      recipientEmail: parsed.data.recipientEmail,
      content: parsed.data.content
    }
  });

  return { success: true } as const;
}
