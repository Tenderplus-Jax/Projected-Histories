create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (auth_user_id, first_name, last_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    lower(new.email)
  );

  return new;
end;
$$;

create or replace function public.handle_updated_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    first_name = coalesce(new.raw_user_meta_data ->> 'first_name', first_name),
    last_name = coalesce(new.raw_user_meta_data ->> 'last_name', last_name),
    email = lower(new.email),
    updated_at = now()
  where auth_user_id = new.id;

  return new;
end;
$$;

create or replace trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

create or replace trigger on_auth_user_updated
after update on auth.users
for each row
execute function public.handle_updated_user_profile();

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();

create trigger update_memberships_updated_at
before update on public.project_memberships
for each row
execute function public.update_updated_at_column();

alter table public.profiles enable row level security;
alter table public.project_memberships enable row level security;

create policy "profiles_users_can_read_own_profile"
on public.profiles
for select
using (auth.uid() = auth_user_id);

create policy "profiles_users_can_update_own_profile"
on public.profiles
for update
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

create policy "profiles_users_can_insert_own_profile"
on public.profiles
for insert
with check (auth.uid() = auth_user_id);

create policy "memberships_users_can_read_own_membership"
on public.project_memberships
for select
using (
  user_id = (
    select id from public.profiles where auth_user_id = auth.uid()
  )
);

create policy "memberships_users_cannot_update_own_status"
on public.project_memberships
for update
using (false)
with check (false);

create policy "memberships_users_cannot_insert_own_membership"
on public.project_memberships
for insert
with check (false);

create policy "memberships_users_cannot_delete_own_membership"
on public.project_memberships
for delete
using (false);

create policy "project_memberships_admin_read_all"
on public.project_memberships
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and p.email = 'admin@projectedhistories.test'
  )
);

create policy "project_memberships_admin_update_all"
on public.project_memberships
for update
using (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and p.email = 'admin@projectedhistories.test'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and p.email = 'admin@projectedhistories.test'
  )
);
