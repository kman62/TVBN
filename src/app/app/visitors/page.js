import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';

async function getVisitors() {
  const supabase = createServerClient();
  const { data } = await supabase.from('visitors').select('*').order('created_at', { ascending: false }).limit(50);
  return data ?? [];
}

export const dynamic = 'force-dynamic';

export default async function VisitorsPage() {
  const visitors = await getVisitors();

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand">Visitor ops</p>
          <h1 className="text-3xl font-semibold">Weekly Zoom pipeline</h1>
        </div>
        <Link className="btn-primary" href="/app">
          Back to dashboard
        </Link>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Source</th>
              <th className="p-4 font-medium">Notes</th>
              <th className="p-4 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map(visitor => (
              <tr key={visitor.id} className="border-t border-slate-800/70">
                <td className="p-4 font-semibold">{visitor.name}</td>
                <td className="p-4 capitalize text-slate-300">{visitor.status}</td>
                <td className="p-4 text-slate-400">{visitor.source}</td>
                <td className="p-4 text-slate-400">{visitor.notes}</td>
                <td className="p-4 text-slate-500">{new Date(visitor.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!visitors.length && (
              <tr>
                <td className="p-6 text-center text-slate-500" colSpan={5}>
                  No visitors captured yet. Plug in your inviting automations.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
