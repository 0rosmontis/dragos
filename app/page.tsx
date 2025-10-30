import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

import { ConversationPreview } from '@/components/home/conversation-preview';
import { FeaturesGrid } from '@/components/home/features-grid';
import { FinalCallToAction } from '@/components/home/final-cta';
import { Testimonials } from '@/components/home/testimonials';
import { WorkflowSteps } from '@/components/home/workflow-steps';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-32 pt-24">
      <section className="space-y-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand.light/30 px-3 py-1 text-sm font-semibold text-brand dark:bg-brand.dark/40 dark:text-brand.light">
          <ShieldCheck className="h-4 w-4" />
          Modern messaging for every team
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Chat, call, and share in one familiar app.</h1>
        <p className="mx-auto max-w-3xl text-lg text-slate-300">
          Dragos is a full-featured messaging experience with realtime rooms, secure profiles, and built-in workflows.
          Keep conversations organized, whether you&apos;re planning a launch or catching up with friends.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild>
            <Link href="/chat" className="inline-flex items-center gap-2">
              Open chat workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/send-message">Send quick anonymous note</Link>
          </Button>
        </div>
      </section>
      <ConversationPreview />
      <FeaturesGrid />
      <WorkflowSteps />
      <Testimonials />
      <FinalCallToAction />
    </div>
  );
}
