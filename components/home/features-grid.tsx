import { MessageSquare, ShieldCheck, Users, Zap } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Instant messaging',
    description: 'Stay in sync with typing indicators, read receipts, and pinned threads for every conversation.',
    icon: MessageSquare
  },
  {
    title: 'Private and group rooms',
    description: 'Spin up personal DMs or persistent team channels with access controls that fit your workflow.',
    icon: Users
  },
  {
    title: 'Secure by default',
    description: 'Every account is protected with modern auth, anti-spam tools, and fine-grained session management.',
    icon: ShieldCheck
  },
  {
    title: 'Responsive on every device',
    description: 'Enjoy fluid performance on desktop, tablet, and mobile with blazing-fast realtime updates.',
    icon: Zap
  }
];

export function FeaturesGrid() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand.light">Why teams switch to Dragos</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-50">Features built for everyday messaging</h2>
        <p className="mt-3 text-sm text-slate-400">
          Realtime delivery, delightful UX, and smart productivity tools keep your conversations flowing.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="h-full border-slate-800/80 bg-slate-900/60 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500">Unlimited rooms, reliable delivery, accessible UI.</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
