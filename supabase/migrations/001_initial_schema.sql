
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Create a table for custom pokemon
create table custom_pokemon (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users on delete cascade not null,
  name text not null,
  species_id text not null, -- The base species (e.g., 'charmander')
  stats jsonb not null, -- { hp, atk, def, spa, spd, spe }
  types text[] not null, -- ['Fire', 'Flying']
  moves text[] not null, -- ['ember', 'scratch']
  ability text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table custom_pokemon enable row level security;

create policy "Pokemon are viewable by everyone." on custom_pokemon
  for select using (true);

create policy "Users can insert their own pokemon." on custom_pokemon
  for insert with check ((select auth.uid()) = owner_id);

create policy "Users can delete their own pokemon." on custom_pokemon
  for delete using ((select auth.uid()) = owner_id);

-- Create a table for lobbies
create table lobbies (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  host_id uuid references auth.users on delete cascade not null,
  state text not null default 'waiting', -- 'waiting', 'battling', 'finished'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table lobbies enable row level security;

create policy "Lobbies are viewable by everyone." on lobbies
  for select using (true);

create policy "Users can create lobbies." on lobbies
  for insert with check ((select auth.uid()) = host_id);

create policy "Host can update lobby." on lobbies
  for update using ((select auth.uid()) = host_id);
