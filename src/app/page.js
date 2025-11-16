import Link from 'next/link';

const featureList = [
  {
    title: 'AI-assisted onboarding',
    copy: 'Collect member data once and syndicate it across LocalTemecula.com + LivingInTemeculaCA.com.'
  },
  {
    title: 'Referral + accountability loop',
    copy: 'Realtime activity feed, 1:1 tracking, and automated digests keep chapters accountable.'
  },
  {
    title: 'Content studio',
    copy: 'Generate captions, schedule posts, and push promos into the Facebook group with one click.'
  }
];

export default function MarketingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-16">
      <section className="grid gap-6 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-brand">Temecula Valley Business Network</p>
        <h1 className="text-4xl font-semibold md:text-6xl">Cloud-native networking built for locals</h1>
        <p className="text-lg text-slate-300">
          Centralize members, referrals, content, and visitors in one Supabase-powered hub. Layer on AI
          assistance to give your chapters the MNO-style edge with Temecula tech DNA.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link className="btn-primary" href="/app">
            Enter dashboard
          </Link>
          <Link className="rounded-lg border border-slate-700 px-4 py-2 font-semibold" href="/onboarding">
            Member onboarding
          </Link>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {featureList.map(feature => (
          <article key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 text-left">
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{feature.copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
