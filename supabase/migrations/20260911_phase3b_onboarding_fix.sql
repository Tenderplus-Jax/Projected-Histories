alter table public.profiles
  add column if not exists is_admin boolean not null default false;

alter table public.project_memberships
  add column if not exists role text not null default 'member';

-- Backfill any existing profiles without a membership record.
insert into public.project_memberships (user_id, status, role)
select p.id, 'pending', 'member'
from public.profiles p
left join public.project_memberships m on m.user_id = p.id
where m.id is null
on conflict (user_id) do nothing;

-- Safe development-only bootstrap for the pre-existing admin account.
update public.profiles
set is_admin = true
where lower(email) = lower('admin@projectedhistories.test')
  and is_admin is not true;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (auth_user_id, first_name, last_name, email, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    lower(new.email),
    false
  )
  on conflict (auth_user_id) do nothing;

  insert into public.project_memberships (user_id, status, role)
  select p.id, 'pending', 'member'
  from public.profiles p
  where p.auth_user_id = new.id
  on conflict (user_id) do nothing;

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

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_project_admin()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and p.is_admin = true
  );
end;
$$;

grant execute on function public.is_project_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.project_memberships enable row level security;

drop policy if exists "profiles_users_can_read_own_profile" on public.profiles;
drop policy if exists "profiles_users_can_update_own_profile" on public.profiles;
drop policy if exists "profiles_users_can_insert_own_profile" on public.profiles;
drop policy if exists "profiles_admin_read_all" on public.profiles;

drop policy if exists "memberships_users_can_read_own_membership" on public.project_memberships;
drop policy if exists "memberships_users_cannot_update_own_status" on public.project_memberships;
drop policy if exists "memberships_users_cannot_insert_own_membership" on public.project_memberships;
drop policy if exists "memberships_users_cannot_delete_own_membership" on public.project_memberships;
drop policy if exists "project_memberships_admin_read_all" on public.project_memberships;
drop policy if exists "project_memberships_admin_update_all" on public.project_memberships;

create policy "profiles_users_can_read_own_profile"
on public.profiles
for select
using (auth.uid() = auth_user_id);

create policy "profiles_users_can_update_own_profile"
on public.profiles
for update
using (auth.uid() = auth_user_id)
with check (
  auth.uid() = auth_user_id
  and (is_admin = false or public.is_project_admin())
);

create policy "profiles_users_can_insert_own_profile"
on public.profiles
for insert
with check (
  auth.uid() = auth_user_id
  and is_admin = false
);

create policy "profiles_admin_read_all"
on public.profiles
for select
using (public.is_project_admin());

create policy "memberships_users_can_read_own_membership"
on public.project_memberships
for select
using (
  user_id = (
    select id
    from public.profiles
    where auth_user_id = auth.uid()
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
using (public.is_project_admin());

create policy "project_memberships_admin_update_all"
on public.project_memberships
for update
using (public.is_project_admin())
with check (public.is_project_admin());
