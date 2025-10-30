import { prisma } from '@/lib/prisma';

export type ParticipantDTO = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

export type MessageDTO = {
  id: string;
  content: string;
  type: string;
  createdAt: string;
  sender: ParticipantDTO;
};

export type ConversationDTO = {
  id: string;
  title: string;
  isGroup: boolean;
  participants: ParticipantDTO[];
  lastMessage?: MessageDTO;
  messages: MessageDTO[];
};

function buildDisplayTitle(
  title: string | null,
  participants: ParticipantDTO[],
  currentUserId: string
): string {
  if (title && title.trim().length > 0) {
    return title.trim();
  }

  const others = participants.filter((participant) => participant.id !== currentUserId);
  if (others.length === 0) {
    return 'Personal notes';
  }

  return others
    .map((participant) => participant.name?.trim() || participant.email)
    .join(', ');
}

export async function fetchChatOverview(userId: string): Promise<ConversationDTO[]> {
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: 'desc' },
    where: {
      participants: {
        some: { userId }
      }
    },
    include: {
      participants: {
        include: {
          user: true
        }
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 50,
        include: {
          sender: true
        }
      }
    }
  });

  return conversations.map((conversation) => {
    const participants: ParticipantDTO[] = conversation.participants.map((participant) => ({
      id: participant.user.id,
      name: participant.user.name,
      email: participant.user.email,
      image: participant.user.image
    }));

    const messages: MessageDTO[] = conversation.messages.map((message) => ({
      id: message.id,
      content: message.content,
      type: message.type,
      createdAt: message.createdAt.toISOString(),
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        email: message.sender.email,
        image: message.sender.image
      }
    }));

    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;

    return {
      id: conversation.id,
      title: buildDisplayTitle(conversation.title, participants, userId),
      isGroup: conversation.isGroup,
      participants,
      messages,
      lastMessage
    };
  });
}

export async function assertConversationMembership(conversationId: string, userId: string) {
  const participant = await prisma.conversationParticipant.findFirst({
    where: {
      conversationId,
      userId
    }
  });

  if (!participant) {
    throw new Error('You are not a participant in this conversation.');
  }
}
