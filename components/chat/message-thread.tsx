'use client';

import { useEffect, useRef } from 'react';

import type { MessageDTO } from '@/lib/chat';
import { cn } from '@/lib/utils';

type MessageThreadProps = {
  messages: MessageDTO[];
  currentUserId: string;
};

export function MessageThread({ messages, currentUserId }: MessageThreadProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-slate-900/60 bg-slate-950/40 p-6 text-center">
        <p className="text-sm font-semibold text-slate-200">No messages yet</p>
        <p className="max-w-sm text-xs text-slate-500">
          Start the conversation using the composer below. Messages will appear in real time for everyone in the room.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex h-[420px] flex-col gap-4 overflow-y-auto rounded-3xl border border-slate-900/60 bg-slate-950/40 p-6"
    >
      {messages.map((message) => {
        const isSelf = message.sender.id === currentUserId;
        return (
          <div key={message.id} className={cn('flex flex-col gap-1', isSelf ? 'items-end text-right' : 'items-start')}>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-300">{message.sender.name ?? message.sender.email}</span>
              <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p
              className={cn(
                'max-w-md rounded-2xl px-4 py-2 text-sm shadow-lg shadow-slate-950/40',
                isSelf ? 'bg-brand text-white' : 'bg-slate-900 text-slate-200'
              )}
            >
              {message.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
