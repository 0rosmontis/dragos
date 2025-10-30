'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const createConversationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Conversation title must be at least 1 character')
    .max(80, 'Conversation title must be 80 characters or fewer')
    .optional(),
  participantEmails: z
    .array(z.string().email('Every participant must have a valid email'))
    .min(1, 'Add at least one participant')
    .max(10, 'Limit conversations to 10 participants at a time')
});

const sendMessageSchema = z.object({
  conversationId: z.string().cuid('Invalid conversation identifier'),
  content: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Messages are limited to 2000 characters')
});

export async function createConversationAction(input: z.infer<typeof createConversationSchema>) {
  const user = await getCurrentUser();
  if (!user?.id || !user.email) {
    return { success: false, error: 'You must be signed in to start a conversation.' } as const;
  }

  const parsed = createConversationSchema.safeParse(input);
  if (!parsed.success) {
    const [issue] = parsed.error.issues;
    return { success: false, error: issue?.message ?? 'Invalid input' } as const;
  }

  const uniqueEmails = Array.from(
    new Set(parsed.data.participantEmails.map((email) => email.trim().toLowerCase()).filter(Boolean))
  );

  // Ensure the current user is always part of the conversation
  if (!uniqueEmails.includes(user.email.toLowerCase())) {
    uniqueEmails.push(user.email.toLowerCase());
  }

  const participants = await prisma.user.findMany({
    where: {
      email: {
        in: uniqueEmails
      }
    }
  });

  if (participants.length !== uniqueEmails.length) {
    return { success: false, error: 'Some participants do not have Dragos accounts yet.' } as const;
  }

  const targetTitle = parsed.data.title ?? null;

  await prisma.$transaction(async (trx) => {
    const conversation = await trx.conversation.create({
      data: {
        title: targetTitle,
        isGroup: participants.length > 2,
        participants: {
          createMany: {
            data: participants.map((participant) => ({
              userId: participant.id
            }))
          }
        }
      }
    });

    await trx.conversation.update({
      where: { id: conversation.id },
      data: {
        updatedAt: new Date()
      }
    });
  });

  revalidatePath('/chat');
  return { success: true } as const;
}

export async function sendChatMessageAction(input: z.infer<typeof sendMessageSchema>) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return { success: false, error: 'You must be signed in to send messages.' } as const;
  }

  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success) {
    const [issue] = parsed.error.issues;
    return { success: false, error: issue?.message ?? 'Invalid input' } as const;
  }

  const participant = await prisma.conversationParticipant.findFirst({
    where: {
      conversationId: parsed.data.conversationId,
      userId: user.id
    }
  });

  if (!participant) {
    return { success: false, error: 'You are not part of this conversation.' } as const;
  }

  await prisma.chatMessage.create({
    data: {
      conversationId: parsed.data.conversationId,
      senderId: user.id,
      content: parsed.data.content,
      type: 'TEXT'
    }
  });

  await prisma.conversation.update({
    where: { id: parsed.data.conversationId },
    data: { updatedAt: new Date() }
  });

  revalidatePath('/chat');
  return { success: true } as const;
}
