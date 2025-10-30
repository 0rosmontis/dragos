const steps = [
  {
    title: 'Create your space',
    description: 'Sign up in seconds and invite teammates or friends with unique room links.'
  },
  {
    title: 'Start the conversation',
    description: 'Launch DMs, group chats, or project channels with shared files and pinned messages.'
  },
  {
    title: 'Stay in sync',
    description: 'Switch between devices, revisit your history, and jump into calls without leaving the app.'
  }
];

export function WorkflowSteps() {
  return (
    <section className="rounded-3xl border border-slate-900/60 bg-slate-950/40 p-10 backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand.light">How it works</p>
      <h2 className="mt-2 text-3xl font-bold text-slate-50">Three steps to start messaging</h2>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="space-y-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/40 bg-brand/10 text-sm font-semibold text-brand">
              0{index + 1}
            </span>
            <h3 className="text-xl font-semibold text-slate-50">{step.title}</h3>
            <p className="text-sm text-slate-400">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
