-- Team members table
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null default '',
  short_description text not null default '',
  long_description text not null default '',
  email text default '',
  phone text default '',
  photo_url text default '',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.team_members enable row level security;

-- Public read
create policy "Anyone can read team members"
  on public.team_members for select
  to anon, authenticated
  using (true);

-- Authenticated can manage
create policy "Authenticated users can insert team members"
  on public.team_members for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update team members"
  on public.team_members for update
  to authenticated
  using (true);

create policy "Authenticated users can delete team members"
  on public.team_members for delete
  to authenticated
  using (true);

-- Storage bucket for team photos
insert into storage.buckets (id, name, public)
values ('team-photos', 'team-photos', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Anyone can view team photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'team-photos');

create policy "Authenticated can upload team photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'team-photos');

create policy "Authenticated can delete team photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'team-photos');
