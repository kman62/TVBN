import ActivityFeed from '@/components/activity-feed';
import VisitorStatusCards from '@/components/visitor-status-cards';
import Link from 'next/link';

async function getChapter() {
  return {
    id: 'demo-chapter',
    name: 'Temecula Valley',
    meeting_day: 'Wednesdays',
    meeting_link: 'https://zoom.example.com/tvbn'
  };
}

export default async function DashboardPage() {
  const chapter = await getChapter();

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-10">
      <header className="flex flex-col gap-2 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand">Chapter overview</p>
          <h1 className="text-3xl font-semibold">{chapter.name}</h1>
          <p className="text-sm text-slate-400">
            Meetings every {chapter.meeting_day}. <Link className="underline" href={chapter.meeting_link}>Join the Zoom</Link>
          </p>
        </div>
        <Link className="btn-primary" href="/app/visitors">
          Manage visitors
        </Link>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        <div className="col-span-2 space-y-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Activity feed</h2>
            <p className="text-xs text-slate-500">Realtime Supabase channel</p>
          </div>
          <ActivityFeed chapterId={chapter.id} />
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-xl font-semibold">Visitor pipeline</h2>
          <VisitorStatusCards />
        </div>
      </section>
    </div>
  );
}
