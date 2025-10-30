'use client';

import { useEffect, useMemo, useState } from 'react';

import type { ConversationDTO } from '@/lib/chat';
import { CallPanel } from '@/components/chat/call-panel';
import { ConversationList } from '@/components/chat/conversation-list';
import { CreateConversationForm } from '@/components/chat/create-conversation-form';
import { MessageComposer } from '@/components/chat/message-composer';
import { MessageThread } from '@/components/chat/message-thread';

type ChatShellProps = {
  conversations: ConversationDTO[];
  currentUserId: string;
  currentUserName?: string | null;
};

export default function ChatShell({ conversations, currentUserId, currentUserName }: ChatShellProps) {
  const firstConversationId = useMemo(() => conversations[0]?.id ?? null, [conversations]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(firstConversationId);

  useEffect(() => {
    if (!selectedConversationId && firstConversationId) {
      setSelectedConversationId(firstConversationId);
      return;
    }

    const stillExists = conversations.some((conversation) => conversation.id === selectedConversationId);
    if (!stillExists) {
      setSelectedConversationId(firstConversationId);
    }
  }, [conversations, firstConversationId, selectedConversationId]);

  const activeConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <CreateConversationForm />
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
        />
      </aside>
      <section className="space-y-4">
        {activeConversation ? (
          <>
            <MessageThread messages={activeConversation.messages} currentUserId={currentUserId} />
            <MessageComposer conversationId={activeConversation.id} />
            <CallPanel
              conversationId={activeConversation.id}
              userId={currentUserId}
              userName={currentUserName}
            />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-slate-900/60 bg-slate-950/40 p-10 text-center">
            <p className="text-sm font-semibold text-slate-200">No active conversation selected</p>
            <p className="max-w-sm text-xs text-slate-500">
              Use the panel on the left to create a new conversation or pick an existing one to get started.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
