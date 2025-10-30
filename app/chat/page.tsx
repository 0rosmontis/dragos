import { redirect } from 'next/navigation';

import ChatShell from '@/components/chat/chat-shell';
import { getCurrentUser } from '@/lib/auth';
import { fetchChatOverview } from '@/lib/chat';

export const metadata = {
  title: 'Conversations | Dragos'
};

export default async function ChatPage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect('/sign-in');
  }

  const conversations = await fetchChatOverview(user.id);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-16">
      <header className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand.light">Unified workspace</p>
        <h1 className="text-4xl font-bold text-slate-50">Run your conversations, calls, and screenshares in one app</h1>
        <p className="mx-auto max-w-3xl text-sm text-slate-400">
          Create rooms for teammates, share updates in realtime, and spin up encrypted WebRTC calls whenever you need to
          talk things through.
        </p>
      </header>
      <ChatShell conversations={conversations} currentUserId={user.id} currentUserName={user.name} />
    </div>
  );
}
