-- Konten, Sitzungen, Tickets, Produkte, Bestellungen, Rechnungen, Demo-Anfragen und Protokoll.

create table app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  name text not null,
  organisation text not null default '',
  role_title text not null default '',
  phone text not null default '',
  street text not null default '',
  zip_city text not null default '',
  country text not null default 'Schweiz',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);
create unique index app_users_email_key on app_users (lower(email));

create table app_sessions (
  token_hash text primary key,
  user_id uuid not null references app_users (id) on delete cascade,
  user_agent text not null default '',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index app_sessions_user_idx on app_sessions (user_id);

create table app_login_attempts (
  id bigserial primary key,
  key text not null,
  success boolean not null,
  created_at timestamptz not null default now()
);
create index app_login_attempts_key_idx on app_login_attempts (key, created_at);

create table app_password_resets (
  token_hash text primary key,
  user_id uuid not null references app_users (id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  unit text not null default 'Monat',
  price_cents integer not null check (price_cents >= 0),
  vat_rate numeric(4, 2) not null default 8.1,
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create sequence order_number_seq start 1001;
create table orders (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique default nextval('order_number_seq'),
  customer_id uuid not null references app_users (id) on delete restrict,
  status text not null default 'angefragt'
    check (status in ('angefragt', 'bestaetigt', 'in_umsetzung', 'abgeschlossen', 'storniert')),
  customer_note text not null default '',
  internal_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_customer_idx on orders (customer_id, created_at desc);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  description text not null,
  quantity numeric(10, 2) not null check (quantity > 0),
  unit text not null default '',
  unit_price_cents integer not null check (unit_price_cents >= 0),
  vat_rate numeric(4, 2) not null default 8.1,
  position integer not null default 0
);
create index order_items_order_idx on order_items (order_id, position);

create sequence invoice_number_seq start 1;
create table invoices (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique default nextval('invoice_number_seq'),
  order_id uuid not null references orders (id) on delete restrict,
  customer_id uuid not null references app_users (id) on delete restrict,
  status text not null default 'offen' check (status in ('offen', 'bezahlt', 'storniert')),
  issued_on date not null default current_date,
  due_on date not null,
  paid_on date,
  billing jsonb not null,
  items jsonb not null,
  subtotal_cents integer not null,
  vat_cents integer not null,
  total_cents integer not null,
  created_at timestamptz not null default now()
);
create index invoices_customer_idx on invoices (customer_id, issued_on desc);

create sequence ticket_number_seq start 1;
create table tickets (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique default nextval('ticket_number_seq'),
  customer_id uuid not null references app_users (id) on delete restrict,
  subject text not null,
  category text not null default 'frage'
    check (category in ('frage', 'technik', 'abrechnung', 'schulung', 'funktionswunsch', 'sonstiges')),
  priority text not null default 'normal' check (priority in ('niedrig', 'normal', 'hoch', 'dringend')),
  status text not null default 'offen'
    check (status in ('offen', 'in_bearbeitung', 'wartet_auf_kunde', 'geloest', 'geschlossen')),
  assignee_id uuid references app_users (id) on delete set null,
  order_id uuid references orders (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);
create index tickets_customer_idx on tickets (customer_id, updated_at desc);
create index tickets_status_idx on tickets (status, updated_at desc);

create table ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets (id) on delete cascade,
  author_id uuid references app_users (id) on delete set null,
  body text not null,
  internal boolean not null default false,
  created_at timestamptz not null default now()
);
create index ticket_messages_ticket_idx on ticket_messages (ticket_id, created_at);

create table ticket_attachments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets (id) on delete cascade,
  message_id uuid not null references ticket_messages (id) on delete cascade,
  file_name text not null,
  content_type text not null,
  size_bytes integer not null,
  data bytea not null,
  created_at timestamptz not null default now()
);
create index ticket_attachments_message_idx on ticket_attachments (message_id);

create table ticket_events (
  id bigserial primary key,
  ticket_id uuid not null references tickets (id) on delete cascade,
  actor_id uuid references app_users (id) on delete set null,
  kind text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);
create index ticket_events_ticket_idx on ticket_events (ticket_id, created_at);

create table demo_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organisation text not null,
  role_title text not null default '',
  email text not null,
  phone text not null default '',
  beds text not null default '',
  message text not null default '',
  status text not null default 'neu' check (status in ('neu', 'kontaktiert', 'erledigt')),
  created_at timestamptz not null default now()
);

create table audit_log (
  id bigserial primary key,
  actor_id uuid references app_users (id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text not null default '',
  detail text not null default '',
  created_at timestamptz not null default now()
);
create index audit_log_created_idx on audit_log (created_at desc);
