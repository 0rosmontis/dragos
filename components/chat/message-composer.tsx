'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { sendChatMessageAction } from '@/app/chat/actions';
import { Button } from '@/components/ui/button';

type MessageComposerProps = {
  conversationId: string | null;
};

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isDisabled = !conversationId || isPending;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conversationId || content.trim().length === 0) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await sendChatMessageAction({
        conversationId,
        content
      });

      if (!result.success) {
        setError(result.error ?? 'Unable to send message.');
        return;
      }

      setContent('');
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-slate-900/60 bg-slate-950/40 p-4">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={conversationId ? 'Write a message...' : 'Select a conversation to start typing'}
        className="h-24 w-full resize-none rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        disabled={isDisabled}
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={isDisabled}>
          {isPending ? 'Sending...' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}
