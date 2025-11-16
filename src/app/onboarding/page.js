import OnboardingForm from '@/components/onboarding-form';

export const metadata = {
  title: 'Onboarding | Temecula Business Hub'
};

export default function OnboardingPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-3xl gap-8 px-6 py-12">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-brand">Member intake</p>
        <h1 className="text-4xl font-semibold">Tell us about your business</h1>
        <p className="text-sm text-slate-400">
          Once submitted, our directors will assign you an available seat and sync your profile to the local
          directories.
        </p>
      </div>
      <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
        <OnboardingForm />
      </section>
    </main>
  );
}
