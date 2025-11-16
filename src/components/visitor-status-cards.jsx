import { createServerClient } from '@/lib/supabase-server';
import { Suspense } from 'react';

async function getVisitors() {
  const supabase = createServerClient();
  const { data } = await supabase.from('visitors').select('*').order('created_at', { ascending: false }).limit(100);
  return data ?? [];
}

function CardsInner({ visitors }) {
  const byStatus = visitors.reduce((acc, visitor) => {
    const key = visitor.status ?? 'invited';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const statuses = ['invited', 'registered', 'attended', 'followup', 'converted'];

  return (
    <div className="mt-4 grid gap-4">
      {statuses.map(status => (
        <article key={status} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">{status}</p>
          <p className="text-3xl font-semibold">{byStatus[status] ?? 0}</p>
        </article>
      ))}
    </div>
  );
}

export default function VisitorStatusCards() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-400">Loading visitor stats...</p>}>
      {/* @ts-expect-error Async Server Component */}
      <VisitorStatusData />
    </Suspense>
  );
}

async function VisitorStatusData() {
  const visitors = await getVisitors();
  return <CardsInner visitors={visitors} />;
}
