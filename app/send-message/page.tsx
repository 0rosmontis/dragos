import { ShieldCheck } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SendMessageForm } from '@/components/send-message/send-message-form';

export const metadata = {
  title: 'Send a Message | Dragos'
};

export default function SendMessagePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <section className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-semibold">Deliver a secure message</h1>
        <p className="text-sm text-slate-400">
          Share your thoughts anonymously or attach your details—Dragos keeps every message encrypted in transit.
        </p>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Compose message</CardTitle>
          <CardDescription>Send a private note directly to a user&apos;s inbox.</CardDescription>
        </CardHeader>
        <CardContent>
          <SendMessageForm />
        </CardContent>
      </Card>
    </div>
  );
}
