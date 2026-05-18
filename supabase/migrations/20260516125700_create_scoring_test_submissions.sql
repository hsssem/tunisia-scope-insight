create table if not exists public.scoring_test_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text not null,
  contact_name text,
  contact_email text,
  sector text not null,
  company_size text not null,
  it_function text,
  regulated_data text[] not null default '{}',
  systems text[] not null default '{}',
  answers jsonb not null,
  score jsonb not null,
  global_score numeric(5,2) not null,
  data_maturity numeric(5,2) not null,
  digital_maturity numeric(5,2) not null,
  maturity_level text not null,
  maturity_level_name text not null
);

alter table public.scoring_test_submissions enable row level security;

drop policy if exists "Allow public scoring test submissions" on public.scoring_test_submissions;
create policy "Allow public scoring test submissions"
  on public.scoring_test_submissions
  for insert
  to anon
  with check (true);
