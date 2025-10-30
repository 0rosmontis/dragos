const testimonials = [
  {
    name: 'Sofia Patel',
    role: 'Product Lead, Lumen',
    quote:
      'Dragos gives our team a single space to align. The chat feels fast, the call quality is crisp, and our clients love joining as guests.'
  },
  {
    name: 'Marcus Chen',
    role: 'Founder, Nightshift Studio',
    quote:
      'The conversation history and message search are game changers. I can jump back to any decision in seconds without digging through emails.'
  },
  {
    name: 'Elena Moretti',
    role: 'Marketing Manager, EightyOne',
    quote:
      'I set up our workspace in under five minutes. The onboarding flow is delightful and everyone was chatting right away.'
  }
];

export function Testimonials() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand.light">
          Loved by modern messaging teams
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-50">Customers share their experience</h2>
        <p className="mt-3 text-sm text-slate-400">
          Real feedback from teams who rely on Dragos for daily collaboration and support.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex h-full flex-col justify-between rounded-3xl border border-slate-900/60 bg-slate-950/40 p-6 text-left shadow-lg shadow-slate-950/30"
          >
            <blockquote className="text-sm leading-relaxed text-slate-300">"{testimonial.quote}"</blockquote>
            <figcaption className="mt-6">
              <p className="text-sm font-semibold text-slate-50">{testimonial.name}</p>
              <p className="text-xs text-slate-500">{testimonial.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
