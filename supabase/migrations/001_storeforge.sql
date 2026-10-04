create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  industry text not null default 'other',
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED', 'SUSPENDED')),
  blueprint jsonb not null,
  catalog jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stores_slug_unique unique (slug)
);

create index if not exists stores_owner_id_idx on public.stores(owner_id);
create index if not exists stores_published_slug_idx on public.stores(slug) where status = 'PUBLISHED';

create or replace function public.set_stores_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists stores_updated_at on public.stores;
create trigger stores_updated_at
before update on public.stores
for each row execute function public.set_stores_updated_at();

alter table public.stores enable row level security;

drop policy if exists "Owners can view their stores" on public.stores;
create policy "Owners can view their stores"
on public.stores for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "Owners can create stores" on public.stores;
create policy "Owners can create stores"
on public.stores for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "Owners can update their stores" on public.stores;
create policy "Owners can update their stores"
on public.stores for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Owners can delete their stores" on public.stores;
create policy "Owners can delete their stores"
on public.stores for delete
to authenticated
using (owner_id = auth.uid());

drop policy if exists "Anyone can view published stores" on public.stores;
create policy "Anyone can view published stores"
on public.stores for select
to anon, authenticated
using (status = 'PUBLISHED');
