'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { sendMessageAction } from '@/app/send-message/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const sendMessageSchema = z.object({
  recipientEmail: z.string().email('Please provide a valid email'),
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Messages are limited to 1000 characters')
});

type SendMessageValues = z.infer<typeof sendMessageSchema>;

export function SendMessageForm() {
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SendMessageValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      recipientEmail: '',
      content: ''
    }
  });

  const onSubmit = async (values: SendMessageValues) => {
    setStatus('idle');
    setError(null);
    const result = await sendMessageAction(values);

    if (!result.success) {
      setStatus('error');
      setError(result.error ?? 'Unable to send your message.');
      return;
    }

    setStatus('success');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="recipientEmail" className="block text-sm font-medium text-slate-200">
          Recipient email
        </label>
        <Input
          id="recipientEmail"
          type="email"
          autoComplete="email"
          placeholder="friend@example.com"
          {...register('recipientEmail')}
        />
        {errors.recipientEmail ? (
          <p className="text-xs font-medium text-red-400">{errors.recipientEmail.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-slate-200">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          className="w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          placeholder="Share your thoughts..."
          {...register('content')}
        />
        {errors.content ? <p className="text-xs font-medium text-red-400">{errors.content.message}</p> : null}
      </div>
      {status === 'success' ? <p className="text-sm text-emerald-400">Message sent successfully!</p> : null}
      {status === 'error' && error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  );
}
