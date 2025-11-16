'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@supabase/supabase-js';

const client = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );

export default function OnboardingForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const [status, setStatus] = useState('');

  const onSubmit = async values => {
    setStatus('Saving...');
    try {
      const supabase = client();
      const { error } = await supabase.from('members').insert({
        first_name: values.firstName,
        last_name: values.lastName,
        company: values.company,
        phone: values.phone,
        website: values.website,
        niche: values.niche,
        elevator_pitch: values.pitch,
        ai_tags: values.keywords?.split(',').map(tag => tag.trim())
      });
      if (error) throw error;
      setStatus('Profile saved. We will review within 24 hours.');
      reset();
    } catch (err) {
      console.error(err);
      setStatus(err.message ?? 'Unable to save profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Name</label>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" placeholder="First name" {...register('firstName', { required: true })} />
          <input className="input" placeholder="Last name" {...register('lastName', { required: true })} />
        </div>
        {(errors.firstName || errors.lastName) && (
          <p className="text-xs text-rose-400">First and last name are required.</p>
        )}
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Company</label>
        <input className="input" placeholder="Company name" {...register('company', { required: true })} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Phone</label>
          <input className="input" placeholder="(951) 555-1234" {...register('phone')} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Website</label>
          <input className="input" placeholder="https://" {...register('website')} />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Primary niche</label>
        <input className="input" placeholder="Fractional CIO" {...register('niche', { required: true })} />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Elevator pitch</label>
        <textarea className="input min-h-[120px]" placeholder="How do you help Temecula businesses?" {...register('pitch')} />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">AI keywords</label>
        <input className="input" placeholder="cloud, ai strategy, networking" {...register('keywords')} />
        <p className="text-xs text-slate-400">Comma separated. Used to seed GPT prompts for content generation.</p>
      </div>
      <button className="btn-primary" type="submit">
        Submit application
      </button>
      {status && <p className="text-sm text-slate-300">{status}</p>}
    </form>
  );
}
