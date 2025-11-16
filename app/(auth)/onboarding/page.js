'use client';

import { useForm } from 'react-hook-form';
import Card from '@/components/ui/card';
import PageHeader from '@/components/layout/page-header';
import { useOnboardingStore } from '@/lib/stores/onboarding-store';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

const timeZones = [
  'America/Los_Angeles',
  'America/New_York',
  'Europe/London',
  'Asia/Singapore'
];

export default function OnboardingPage() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      email: '',
      teamName: '',
      timeZone: 'America/Los_Angeles'
    }
  });
  const { teamName, setTeamName, timeZone, setTimeZone, step, nextStep } = useOnboardingStore();

  const onSubmit = async (values) => {
    setTeamName(values.teamName);
    setTimeZone(values.timeZone);

    const supabase = getSupabaseBrowserClient();
    await supabase.from('onboarding').insert({
      email: values.email,
      team_name: values.teamName,
      time_zone: values.timeZone
    });

    nextStep();
    reset({ email: '', teamName: values.teamName, timeZone: values.timeZone });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Secure access"
        title="Onboard your broadcast team"
        description="Collect the minimum context required to invite editors and producers. Data is written to Supabase so future modules can pick it up."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                {...register('email')}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="teamName">
                Team name
              </label>
              <input
                id="teamName"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                {...register('teamName', { required: true })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="timeZone">
                Time zone
              </label>
              <select
                id="timeZone"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
                {...register('timeZone')}
              >
                {timeZones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Save & continue
            </button>
          </form>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Onboarding tracker</h3>
          <dl className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <dt>Current step</dt>
              <dd className="font-medium text-slate-900">{step} / 3</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Team name</dt>
              <dd className="font-medium text-slate-900">{teamName || '—'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Time zone</dt>
              <dd className="font-medium text-slate-900">{timeZone}</dd>
            </div>
          </dl>
          <p className="text-xs text-slate-500">
            The Supabase helpers abstract client creation for both browser and server modules, so you can move from onboarding to
            CRM workflows without duplicating plumbing.
          </p>
        </Card>
      </div>
    </div>
  );
}
