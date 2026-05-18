create extension if not exists pgcrypto with schema extensions;

create table if not exists public.ai_report_settings (
  id text primary key default 'default',
  config jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.ai_report_settings enable row level security;

drop policy if exists "Allow public ai report settings read" on public.ai_report_settings;
create policy "Allow public ai report settings read"
  on public.ai_report_settings
  for select
  to anon
  using (id = 'default');

create or replace function public.update_ai_report_settings(
  p_passcode text,
  p_config jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if encode(extensions.digest(coalesce(p_passcode, ''), 'sha256'), 'hex') <> '9f6f14d121cead2d652a430d125365e55d9658ffee24c5c8d768c763060c86a4' then
    raise exception 'Passcode incorrect.' using errcode = '28000';
  end if;

  insert into public.ai_report_settings (id, config, updated_at)
  values ('default', p_config, now())
  on conflict (id)
  do update set
    config = excluded.config,
    updated_at = excluded.updated_at;

  return p_config;
end;
$$;

grant execute on function public.update_ai_report_settings(text, jsonb) to anon;
