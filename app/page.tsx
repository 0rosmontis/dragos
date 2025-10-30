import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-16 px-6 py-24 text-center">
      <section className="space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand.light/30 px-3 py-1 text-sm font-semibold text-brand dark:bg-brand.dark/40 dark:text-brand.light">
          <ShieldCheck className="h-4 w-4" />
          Secure & Anonymous Messaging
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Connect without compromising your privacy.</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-300">
          Dragos helps you exchange messages confidently. Authenticate, manage your profile, and reach anyone without exposing your identity.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild>
            <Link href="/send-message" className="inline-flex items-center gap-2">
              Start messaging
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/me">Go to my dashboard</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
