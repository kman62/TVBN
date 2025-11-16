-- Enable extensions used in the schema
create extension if not exists "pgcrypto";

-- Enum definitions
create type public.activity_type as enum (
  'MEETING',
  'SERVICE',
  'TRAINING',
  'SOCIAL',
  'DIGITAL_CAMPAIGN'
);

create type public.asset_status as enum (
  'DRAFT',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED'
);

-- Core tables
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  region text,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key references auth.users (id) on delete cascade,
  chapter_id uuid references public.chapters (id) on delete set null,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  phone text,
  role text check (role in ('member', 'lead', 'staff')) default 'member',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  member_id uuid not null references public.members (id) on delete cascade,
  title text not null,
  details text,
  activity_date date not null,
  activity_type public.activity_type not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  referred_by_member uuid references public.members (id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  status text check (status in ('interested', 'contacted', 'joined')) default 'interested',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.content_assets (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  owner_member_id uuid references public.members (id) on delete set null,
  title text not null,
  caption text,
  ai_caption jsonb,
  media_url text not null,
  scheduled_for timestamptz,
  status public.asset_status not null default 'DRAFT',
  channel text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Automatic timestamp updates
create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_content_assets_updated_at
  before update on public.content_assets
  for each row
  execute procedure public.set_current_timestamp_updated_at();
