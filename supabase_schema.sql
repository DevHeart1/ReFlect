-- =====================================================
-- ReFlect Supabase Schema
-- Run this in Supabase SQL Editor to create/update tables
-- =====================================================

-- Create Profiles Table (for user profile data)
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  avatar_url text,
  is_pro boolean default false,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for Profiles
alter table profiles enable row level security;

drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create Journal Entries Table
create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text,
  excerpt text,
  date timestamp with time zone default timezone('utc'::text, now()),
  tags text[] default '{}',
  type text default 'journal',
  mood text,
  icon text,
  color_class text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for Journal Entries
alter table journal_entries enable row level security;

drop policy if exists "Users can view their own entries" on journal_entries;
create policy "Users can view their own entries"
  on journal_entries for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own entries" on journal_entries;
create policy "Users can insert their own entries"
  on journal_entries for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update their own entries" on journal_entries;
create policy "Users can update their own entries"
  on journal_entries for update
  using ( auth.uid() = user_id );

drop policy if exists "Users can delete their own entries" on journal_entries;
create policy "Users can delete their own entries"
  on journal_entries for delete
  using ( auth.uid() = user_id );

-- Create Mood Checkins Table
create table if not exists mood_checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date timestamp with time zone default timezone('utc'::text, now()),
  mood_label text not null,
  mood_score integer not null check (mood_score >= 1 and mood_score <= 5),
  secondary_emotions text[] default '{}',
  factors text[] default '{}',
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for Mood Checkins
alter table mood_checkins enable row level security;

drop policy if exists "Users can view their own moods" on mood_checkins;
create policy "Users can view their own moods"
  on mood_checkins for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own moods" on mood_checkins;
create policy "Users can insert their own moods"
  on mood_checkins for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update their own moods" on mood_checkins;
create policy "Users can update their own moods"
  on mood_checkins for update
  using ( auth.uid() = user_id );

drop policy if exists "Users can delete their own moods" on mood_checkins;
create policy "Users can delete their own moods"
  on mood_checkins for delete
  using ( auth.uid() = user_id );

-- Create User Settings Table
create table if not exists user_settings (
  user_id uuid references auth.users not null primary key,
  theme text default 'system',
  language text default 'English (US)',
  time_zone text default '(UTC-08:00) Pacific',
  font_size integer default 2,
  high_contrast boolean default false,
  screen_reader boolean default false,
  biometric_enabled boolean default true,
  auto_lock_timer text default '15 Minutes',
  ai_personalization boolean default true,
  anonymous_data boolean default false,
  daily_reminders boolean default true,
  reminder_time text default '20:00',
  ai_alerts boolean default true,
  email_summaries boolean default false,
  system_notifications boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for Settings
alter table user_settings enable row level security;

drop policy if exists "Users can view their own settings" on user_settings;
create policy "Users can view their own settings"
  on user_settings for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can update their own settings" on user_settings;
create policy "Users can update their own settings"
  on user_settings for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update their own settings update" on user_settings;
create policy "Users can update their own settings update"
  on user_settings for update
  using ( auth.uid() = user_id );

-- Create Templates Table
create table if not exists templates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  category text,
  icon text,
  color_theme jsonb,
  blocks jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  is_public boolean default false
);

-- Enable RLS for Templates
alter table templates enable row level security;

drop policy if exists "Users can view their own templates" on templates;
create policy "Users can view their own templates"
  on templates for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own templates" on templates;
create policy "Users can insert their own templates"
  on templates for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update their own templates" on templates;
create policy "Users can update their own templates"
  on templates for update
  using ( auth.uid() = user_id );

drop policy if exists "Users can delete their own templates" on templates;
create policy "Users can delete their own templates"
  on templates for delete
  using ( auth.uid() = user_id );
