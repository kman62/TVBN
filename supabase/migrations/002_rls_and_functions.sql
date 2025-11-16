-- Enable RLS
alter table public.chapters enable row level security;
alter table public.members enable row level security;
alter table public.activities enable row level security;
alter table public.visitors enable row level security;
alter table public.content_assets enable row level security;

-- Helper function for chapter scoping
create or replace function public.member_chapter_ids()
returns setof uuid
language sql
security definer
set search_path = public
as $$
  select chapter_id
  from public.members
  where id = auth.uid()
    and chapter_id is not null;
$$;

grant execute on function public.member_chapter_ids() to authenticated;

-- Chapters policies (read by members of chapter)
create policy "Chapters are readable by chapter members"
  on public.chapters
  for select
  using (id in (select member_chapter_ids()));

create policy "Chapter insert/update restricted to service role"
  on public.chapters
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Members policies
create policy "Members can view self"
  on public.members
  for select
  using (id = auth.uid());

create policy "Members can manage self"
  on public.members
  for insert
  with check (id = auth.uid());

create policy "Members can update self"
  on public.members
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Service role full access to members"
  on public.members
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Activities policies
create policy "Members read activities for their chapter"
  on public.activities
  for select
  using (chapter_id in (select member_chapter_ids()));

create policy "Members insert/update activities scoped to their chapter"
  on public.activities
  for insert
  with check (
    chapter_id in (select member_chapter_ids())
    and member_id = auth.uid()
  );

create policy "Members update own activity records"
  on public.activities
  for update
  using (
    member_id = auth.uid()
    and chapter_id in (select member_chapter_ids())
  )
  with check (
    member_id = auth.uid()
    and chapter_id in (select member_chapter_ids())
  );

-- Visitors
create policy "Members read visitors in their chapter"
  on public.visitors
  for select
  using (chapter_id in (select member_chapter_ids()));

create policy "Members manage visitors for their chapter"
  on public.visitors
  for insert
  with check (chapter_id in (select member_chapter_ids()));

create policy "Members update visitors for their chapter"
  on public.visitors
  for update
  using (chapter_id in (select member_chapter_ids()))
  with check (chapter_id in (select member_chapter_ids()));

-- Content assets
create policy "Members read chapter content assets"
  on public.content_assets
  for select
  using (chapter_id in (select member_chapter_ids()));

create policy "Members insert assets for their chapter"
  on public.content_assets
  for insert
  with check (chapter_id in (select member_chapter_ids()));

create policy "Members update their chapter assets"
  on public.content_assets
  for update
  using (chapter_id in (select member_chapter_ids()))
  with check (chapter_id in (select member_chapter_ids()));

-- Service role policy catch-all
create policy "Service role bypasses RLS"
  on public.content_assets
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role bypasses activities RLS"
  on public.activities
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role bypasses visitors RLS"
  on public.visitors
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role bypasses chapters RLS"
  on public.chapters
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Administrative helper functions
create or replace function public.admin_upsert_chapter(
  p_id uuid,
  p_name text,
  p_slug text,
  p_description text,
  p_region text
) returns public.chapters
language plpgsql
security definer
set search_path = public
as $$
declare
  _chapter public.chapters;
begin
  insert into public.chapters (id, name, slug, description, region)
  values (coalesce(p_id, gen_random_uuid()), p_name, p_slug, p_description, p_region)
  on conflict (id) do update set
    name = excluded.name,
    slug = excluded.slug,
    description = excluded.description,
    region = excluded.region
  returning * into _chapter;
  return _chapter;
end;
$$;

create or replace function public.admin_assign_member_to_chapter(
  p_member_id uuid,
  p_chapter_id uuid,
  p_role text default 'member'
) returns public.members
language plpgsql
security definer
set search_path = public
as $$
declare
  _member public.members;
begin
  update public.members
  set chapter_id = p_chapter_id,
      role = coalesce(p_role, role)
  where id = p_member_id
  returning * into _member;
  return _member;
end;
$$;

revoke all on function public.admin_upsert_chapter(uuid, text, text, text, text) from public;
revoke all on function public.admin_assign_member_to_chapter(uuid, uuid, text) from public;

grant execute on function public.admin_upsert_chapter(uuid, text, text, text, text) to service_role;
grant execute on function public.admin_assign_member_to_chapter(uuid, uuid, text) to service_role;
