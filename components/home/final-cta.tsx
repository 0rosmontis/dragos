import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function FinalCallToAction() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand.dark via-brand to-slate-900 p-10 text-left shadow-xl shadow-brand/30">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand.light/20 blur-3xl" />
      <div className="absolute -bottom-16 right-10 h-52 w-52 rounded-full bg-brand.light/10 blur-3xl" />
      <div className="relative space-y-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand.light/80">Ready when you are</p>
        <h2 className="text-3xl font-bold text-white md:text-4xl">Turn Dragos into your everyday chat companion</h2>
        <p className="max-w-xl text-sm text-brand.light/90">
          Create a workspace, invite teammates, and start messaging in minutes. Powerful features and a friendly
          interface help you stay connected.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button asChild variant="secondary">
            <Link href="/sign-up" className="inline-flex items-center gap-2">
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/send-message" className="text-brand.light">
              Explore messaging tools
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
