'use client';

import type { ConversationDTO } from '@/lib/chat';
import { cn } from '@/lib/utils';

type ConversationListProps = {
  conversations: ConversationDTO[];
  selectedId?: string | null;
  onSelect: (conversationId: string) => void;
};

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function formatRelativeTime(date: Date) {
  const diffInMs = date.getTime() - Date.now();
  const diffInMinutes = Math.round(diffInMs / (1000 * 60));

  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  }

  const diffInDays = Math.round(diffInHours / 24);
  return rtf.format(diffInDays, 'day');
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-900/60 bg-slate-950/40 p-6 text-center">
        <p className="text-sm text-slate-400">No conversations yet. Start one to begin chatting.</p>
      </div>
    );
  }

  return (
    <nav className="space-y-2">
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedId;
        const lastMessagePreview = conversation.lastMessage
          ? `${conversation.lastMessage.sender.name ?? conversation.lastMessage.sender.email}: ${conversation.lastMessage.content}`
          : 'No messages yet';

        return (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={cn(
              'w-full rounded-2xl border px-4 py-3 text-left transition hover:border-brand/50 hover:bg-slate-900/60',
              isSelected
                ? 'border-brand bg-slate-900/70 text-brand.light'
                : 'border-slate-900/60 bg-slate-950/40 text-slate-200'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{conversation.title}</p>
              {conversation.lastMessage ? (
                <span className="text-xs text-slate-500">
                  {formatRelativeTime(new Date(conversation.lastMessage.createdAt))}
                </span>
              ) : null}
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-slate-400">{lastMessagePreview}</p>
          </button>
        );
      })}
    </nav>
  );
}
