-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique constraint username_length check (char_length(username) >= 3 and char_length(username) <= 30),
  full_name text,
  avatar_url text,
  published boolean default false,
  template_id text default 'minimal',
  theme jsonb default '{"primaryColor": "#000000", "fontFamily": "Inter"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PORTFOLIO DATA TABLE
create table public.portfolio_data (
  profile_id uuid references public.profiles(id) on delete cascade primary key,
  tagline text,
  bio text,
  location text,
  education jsonb default '[]'::jsonb,
  experience jsonb default '[]'::jsonb,
  projects jsonb default '[]'::jsonb,
  skills jsonb default '[]'::jsonb,
  achievements jsonb default '[]'::jsonb,
  links jsonb default '[]'::jsonb,
  resume_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TEMPLATES TABLE
create table public.templates (
  id text primary key,
  name text not null,
  description text,
  preview_url text,
  is_active boolean default true,
  is_pro boolean default false
);

-- SUBSCRIPTIONS TABLE
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan text default 'free' check (plan in ('free', 'pro')),
  razorpay_payment_id text,
  amount integer,
  coupon_code text,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COUPONS TABLE
create table public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  discount_type text check (discount_type in ('percentage', 'flat')),
  discount_value integer not null,
  max_uses integer,
  current_uses integer default 0,
  expires_at timestamp with time zone,
  is_active boolean default true
);

-- COUPON USES TABLE
create table public.coupon_uses (
  id uuid default uuid_generate_v4() primary key,
  coupon_id uuid references public.coupons(id) on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  used_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(coupon_id, user_id)
);

-- AMBASSADORS TABLE
create table public.ambassadors (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  commission_rate float default 0.1,
  total_earnings integer default 0,
  total_referrals integer default 0,
  upi_id text,
  is_active boolean default true
);

-- ANALYTICS EVENTS TABLE
create table public.analytics_events (
  id uuid default uuid_generate_v4() primary key,
  username text not null,
  event_type text default 'view',
  referrer text,
  country text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INDEXES
create index idx_profiles_username on public.profiles(username);
create index idx_analytics_events_username_created on public.analytics_events(username, created_at);
create index idx_coupons_code on public.coupons(code);

-- RLS POLICIES

-- Profiles: Anyone can read if published, only owner can update
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone if published" on public.profiles
  for select using (published = true);
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Portfolio Data: Anyone can read if profile is published, only owner can update
alter table public.portfolio_data enable row level security;
create policy "Portfolio data is viewable by everyone if profile published" on public.portfolio_data
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = portfolio_data.profile_id and profiles.published = true
    )
  );
create policy "Users can view their own portfolio data" on public.portfolio_data
  for select using (auth.uid() = profile_id);
create policy "Users can update their own portfolio data" on public.portfolio_data
  for update using (auth.uid() = profile_id);
create policy "Users can insert their own portfolio data" on public.portfolio_data
  for insert with check (auth.uid() = profile_id);

-- Analytics: Anyone can insert, only owner can read their own stats
alter table public.analytics_events enable row level security;
create policy "Anyone can insert analytics events" on public.analytics_events
  for insert with check (true);
create policy "Users can view their own analytics" on public.analytics_events
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.username = analytics_events.username and profiles.id = auth.uid()
    )
  );

-- TRIGGER TO CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  insert into public.portfolio_data (profile_id)
  values (new.id);

  insert into public.subscriptions (user_id, plan)
  values (new.id, 'free');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RESERVED USERNAMES TRIGGER
create or replace function public.check_reserved_username()
returns trigger as $$
declare
  reserved text[] := ARRAY['admin', 'api', 'www', 'help', 'support', 'blog', 'pricing', 'login', 'signup', 'dashboard', 'onboarding', 'settings', 'about', 'contact', 'terms', 'privacy', 'policy', 'sitemap', 'robots', 'me', 'home', 'index', 'null', 'undefined', 'profile', 'templates', 'upload', 'resume'];
begin
  if new.username is not null and lower(new.username) = any(reserved) then
    raise exception 'Username "%" is reserved and cannot be claimed.', new.username;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger enforce_reserved_username
  before insert or update of username on public.profiles
  for each row execute procedure public.check_reserved_username();

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) 
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- STORAGE POLICIES
create policy "Users can upload their own resume"
  on storage.objects for insert
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view their own resume"
  on storage.objects for select
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own resume"
  on storage.objects for update
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own resume"
  on storage.objects for delete
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);


