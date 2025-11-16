import Link from 'next/link';
import PageHeader from '@/components/layout/page-header';
import Card from '@/components/ui/card';
import InitiativeCard from '@/components/ui/initiative-card';
import { format } from 'date-fns';

const initiatives = [
  {
    title: 'Activity Feed',
    description: 'Surface network-wide updates, scheduling signals, and production blockers in one realtime stream.',
    status: 'In Discovery',
    eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21)
  },
  {
    title: 'Visitor CRM',
    description: 'Relationship graph and retention workflows for high-intent visitors.',
    status: 'Scoping',
    eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35)
  },
  {
    title: 'Content Studio',
    description: 'Collaborative space to plan, script, and ship broadcast packages.',
    status: 'Prototyping',
    eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 55)
  }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Mission Control"
        title="TVBN Operating Workspace"
        description="This scaffold ships the shared layout, navigation, auth group, and Supabase helpers so feature teams can focus on experience instead of plumbing."
        cta={{ href: '/(auth)/onboarding', label: 'Open onboarding' }}
      />

      <div id="initiatives" className="grid gap-6 md:grid-cols-3">
        {initiatives.map((initiative) => (
          <InitiativeCard
            key={initiative.title}
            title={initiative.title}
            description={initiative.description}
            status={initiative.status}
            eta={format(initiative.eta, 'MMM d, yyyy')}
          />
        ))}
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Next steps</h3>
            <p className="text-sm text-slate-600">
              Use this foundation to plug in Supabase auth, real-time data, and CRM workflows.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/(auth)/onboarding"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm"
            >
              Configure access
            </Link>
            <Link href="https://supabase.com" className="rounded-md border px-4 py-2 text-sm font-medium">
              Supabase docs
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
