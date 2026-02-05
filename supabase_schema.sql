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

create policy "Users can view their own settings"
  on user_settings for select
  using ( auth.uid() = user_id );

create policy "Users can update their own settings"
  on user_settings for insert
  with check ( auth.uid() = user_id );

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
  is_public boolean default false -- For potential sharing later
);

-- Enable RLS for Templates
alter table templates enable row level security;

create policy "Users can view their own templates"
  on templates for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own templates"
  on templates for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own templates"
  on templates for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own templates"
  on templates for delete
  using ( auth.uid() = user_id );
