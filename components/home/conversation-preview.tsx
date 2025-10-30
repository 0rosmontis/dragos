import { MessageCircle, PhoneCall } from 'lucide-react';

const conversation = [
  {
    id: '1',
    sender: 'you',
    time: '09:32',
    message: 'Hey, are we still on for the product sync later today?',
    accent: 'from-brand/20 text-brand.light'
  },
  {
    id: '2',
    sender: 'them',
    time: '09:33',
    message: "Absolutely! Let me finish uploading the latest mockups and I'll ping the team.",
    accent: 'from-slate-800 text-slate-200'
  },
  {
    id: '3',
    sender: 'you',
    time: '09:34',
    message: "Perfect. Drop the call link here and I'll invite Alex as well.",
    accent: 'from-brand/20 text-brand.light'
  },
  {
    id: '4',
    sender: 'them',
    time: '09:35',
    message: 'Done! Added the link and notes in the chat. Talk soon.',
    accent: 'from-slate-800 text-slate-200'
  }
];

export function ConversationPreview() {
  return (
    <section className="grid gap-10 rounded-3xl border border-slate-900/60 bg-slate-900/40 p-10 backdrop-blur-md lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/15 text-brand">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand.light">Live conversations</p>
            <h2 className="text-2xl font-semibold text-slate-50">Keep every chat aligned and focused</h2>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-900/60 bg-slate-950/60 p-6">
          {conversation.map((item) => (
            <article
              key={item.id}
              className={`w-fit max-w-full rounded-2xl bg-gradient-to-br ${item.accent} px-5 py-3 text-left shadow-lg shadow-slate-950/30`}
            >
              <p className="text-sm font-medium capitalize text-slate-400">{item.sender}</p>
              <p className="mt-2 text-sm leading-relaxed">{item.message}</p>
              <span className="mt-2 block text-xs text-slate-400">{item.time}</span>
            </article>
          ))}
        </div>
      </div>
      <aside className="flex flex-col justify-between gap-8 rounded-2xl border border-slate-900/50 bg-slate-950/50 p-8 text-left shadow-inner shadow-brand/10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand.light">Designed for teams</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-50">Call, chat, and share files in one place</h3>
          <p className="mt-4 text-sm text-slate-400">
            Keep your focus inside a single conversation hub. Start a call, pin key decisions, and review your shared
            history without juggling multiple apps.
          </p>
        </div>
        <div className="rounded-2xl border border-brand/30 bg-brand.dark/40 p-6 text-brand.light shadow-lg shadow-brand/20">
          <div className="flex items-center gap-3">
            <PhoneCall className="h-6 w-6" />
            <div>
              <p className="text-sm font-medium uppercase tracking-wide">Instant calls</p>
              <p className="text-xs text-brand.light/70">Jump into voice or video with a single tap.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>- Share screen and schedule recordings</li>
            <li>- Sync notes directly into your chat</li>
            <li>- Invite external guests securely</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}
