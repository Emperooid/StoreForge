create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  order_number text not null unique,
  customer jsonb not null,
  items jsonb not null,
  subtotal integer not null check (subtotal >= 0),
  total integer not null check (total >= 0),
  currency text not null default 'NGN',
  status text not null default 'PENDING' check (status in ('PENDING', 'CONFIRMED', 'FULFILLED', 'CANCELLED')),
  payment_status text not null default 'UNPAID' check (payment_status in ('UNPAID', 'PAID', 'REFUNDED')),
  created_at timestamptz not null default now()
);

create index if not exists orders_store_id_created_at_idx
  on public.orders(store_id, created_at desc);

alter table public.orders enable row level security;

drop policy if exists "Store owners can view orders" on public.orders;
create policy "Store owners can view orders"
on public.orders for select
to authenticated
using (
  exists (
    select 1 from public.stores
    where stores.id = orders.store_id
      and stores.owner_id = auth.uid()
  )
);

drop policy if exists "Public can create orders for published stores" on public.orders;
create policy "Public can create orders for published stores"
on public.orders for insert
to anon, authenticated
with check (
  exists (
    select 1 from public.stores
    where stores.id = orders.store_id
      and stores.status = 'PUBLISHED'
  )
);

drop policy if exists "Store owners can update orders" on public.orders;
create policy "Store owners can update orders"
on public.orders for update
to authenticated
using (
  exists (
    select 1 from public.stores
    where stores.id = orders.store_id
      and stores.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.stores
    where stores.id = orders.store_id
      and stores.owner_id = auth.uid()
  )
);
