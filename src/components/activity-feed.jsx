'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityFeed({ chapterId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel;
    async function init() {
      await loadActivities();
      channel = supabaseBrowser
        .channel('public:activities')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'activities', filter: `chapter_id=eq.${chapterId}` },
          payload => setActivities(prev => [payload.new, ...prev].slice(0, 25))
        )
        .subscribe();
    }
    init();
    return () => {
      if (channel) supabaseBrowser.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  async function loadActivities() {
    const { data } = await supabaseBrowser
      .from('activities')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('occurred_at', { ascending: false })
      .limit(25);
    setActivities(data ?? []);
    setLoading(false);
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Loading activity...</p>;
  }

  if (!activities.length) {
    return <p className="text-sm text-slate-500">No activity yet. Start logging referrals.</p>;
  }

  return (
    <ul className="space-y-3">
      {activities.map(activity => (
        <li key={activity.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-sm font-semibold capitalize text-white">{activity.type.replace(/_/g, ' ')}</p>
          <p className="text-xs text-slate-400">
            {activity.actor_member_name}{' '}
            {activity.target_member_name && (
              <>
                <span className="text-slate-500">→</span> {activity.target_member_name}
              </>
            )}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            {formatDistanceToNow(new Date(activity.occurred_at), { addSuffix: true })}
          </p>
        </li>
      ))}
    </ul>
  );
}
