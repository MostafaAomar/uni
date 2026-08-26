-- Run this once in Supabase Dashboard > SQL Editor for the project used by UniQuiz.
-- It keeps every user's words, notes, and study progress private.

create table if not exists public.user_app_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_app_data enable row level security;

alter table public.user_app_data
  drop constraint if exists user_app_data_payload_is_object;
alter table public.user_app_data
  add constraint user_app_data_payload_is_object
  check (jsonb_typeof(data) = 'object');

alter table public.user_app_data
  drop constraint if exists user_app_data_payload_size;
alter table public.user_app_data
  add constraint user_app_data_payload_size
  check (octet_length(data::text) <= 2000000);

create or replace function public.set_user_app_data_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;

drop trigger if exists set_user_app_data_updated_at on public.user_app_data;
create trigger set_user_app_data_updated_at
before insert or update on public.user_app_data
for each row execute function public.set_user_app_data_updated_at();

revoke all on table public.user_app_data from anon;
grant select, insert, update on table public.user_app_data to authenticated;

drop policy if exists "UniQuiz users can read own data" on public.user_app_data;
create policy "UniQuiz users can read own data"
on public.user_app_data
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "UniQuiz users can insert own data" on public.user_app_data;
create policy "UniQuiz users can insert own data"
on public.user_app_data
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "UniQuiz users can update own data" on public.user_app_data;
create policy "UniQuiz users can update own data"
on public.user_app_data
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
