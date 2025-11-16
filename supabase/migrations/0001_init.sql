create extension if not exists "uuid-ossp";

create type public.activity_type as enum (
  'referral_given',
  'referral_received',
  'visitor_invited',
  'session_completed',
  'content_shared'
);

create table if not exists public.chapters (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city text,
  meeting_day text,
  meeting_link text,
  director_id uuid,
  created_at timestamptz default now()
);

create table if not exists public.members (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  chapter_id uuid references public.chapters on delete set null,
  first_name text not null,
  last_name text not null,
  company text,
  role text,
  phone text,
  website text,
  niche text,
  elevator_pitch text,
  ai_tags text[],
  created_at timestamptz default now()
);

create table if not exists public.activities (
  id uuid primary key default uuid_generate_v4(),
  chapter_id uuid references public.chapters on delete cascade,
  actor_member_id uuid references public.members on delete cascade,
  actor_member_name text,
  target_member_id uuid references public.members on delete set null,
  target_member_name text,
  type public.activity_type not null,
  payload jsonb,
  occurred_at timestamptz default now()
);

create table if not exists public.visitors (
  id uuid primary key default uuid_generate_v4(),
  chapter_id uuid references public.chapters on delete cascade,
  name text,
  email text,
  phone text,
  status text check (status in ('invited','registered','attended','followup','converted')) default 'invited',
  source text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.content_assets (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references public.members on delete cascade,
  title text,
  platforms text[],
  caption text,
  scheduled_for timestamptz,
  status text check (status in ('draft','scheduled','published')) default 'draft',
  stats jsonb,
  created_at timestamptz default now()
);

alter table public.members enable row level security;
alter table public.activities enable row level security;
alter table public.visitors enable row level security;
alter table public.content_assets enable row level security;

create policy "Members can view themselves" on public.members
  for select using (auth.uid() = user_id);

create policy "Members can update themselves" on public.members
  for update using (auth.uid() = user_id);

create policy "Chapter activity read" on public.activities
  for select using (
    exists (
      select 1
      from public.members m
      where m.id = activities.actor_member_id
        and m.user_id = auth.uid()
    )
  );

create policy "Insert own activity" on public.activities
  for insert with check (
    exists (
      select 1
      from public.members m
      where m.id = actor_member_id
        and m.user_id = auth.uid()
    )
  );

create policy "Visitor read" on public.visitors
  for select using (
    exists (
      select 1
      from public.members m
      where m.chapter_id = visitors.chapter_id
        and m.user_id = auth.uid()
    )
  );

create policy "Content read" on public.content_assets
  for select using (
    exists (
      select 1
      from public.members m
      where m.id = content_assets.member_id
        and m.user_id = auth.uid()
    )
  );

create policy "Content modify" on public.content_assets
  for all using (
    exists (
      select 1
      from public.members m
      where m.id = content_assets.member_id
        and m.user_id = auth.uid()
    )
  );
