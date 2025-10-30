'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { createConversationAction } from '@/app/chat/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CreateConversationForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [emailsInput, setEmailsInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const participantEmails = emailsInput
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

    if (participantEmails.length === 0) {
      setError('Add at least one participant email.');
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await createConversationAction({
        title: title.trim() || undefined,
        participantEmails
      });

      if (!result.success) {
        setError(result.error ?? 'Unable to create conversation.');
        return;
      }

      setTitle('');
      setEmailsInput('');
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-900/60 bg-slate-950/40 p-4">
      <div className="space-y-2">
        <label htmlFor="conversation-title" className="block text-sm font-medium text-slate-200">
          Conversation title (optional)
        </label>
        <Input
          id="conversation-title"
          placeholder="Product Launch Sync"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="conversation-emails" className="block text-sm font-medium text-slate-200">
          Participant emails
        </label>
        <Input
          id="conversation-emails"
          placeholder="alex@example.com, morgan@example.com"
          value={emailsInput}
          onChange={(event) => setEmailsInput(event.target.value)}
          disabled={isPending}
        />
        <p className="text-xs text-slate-500">Separate multiple emails with commas. You&apos;ll be added automatically.</p>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create conversation'}
        </Button>
      </div>
    </form>
  );
}
