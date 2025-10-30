import { redirect } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'My Dashboard | Dragos'
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.email) {
    redirect('/sign-in');
  }

  const messages = await prisma.message.findMany({
    where: { recipientEmail: user.email },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold">Hey {user.name ?? 'there'} 👋</h1>
        <p className="text-sm text-slate-400">Here&apos;s a snapshot of your latest private messages.</p>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent messages</CardTitle>
            <CardDescription>Your 10 most recent incoming messages.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-sm text-slate-400">You haven&apos;t received any messages yet.</p>
            ) : (
              messages.map((message) => (
                <article key={message.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-200">{message.content}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </article>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
            <CardDescription>Your profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>
              <span className="font-medium text-slate-200">Name:</span> {user.name ?? 'Unknown'}
            </p>
            <p>
              <span className="font-medium text-slate-200">Email:</span> {user.email}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
