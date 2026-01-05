
-- Add guest_id to lobbies
alter table lobbies add column guest_id uuid references auth.users on delete set null;

-- Allow anyone to update the lobby if they are joining (guest_id is null)
-- OR allow the specific guest to update it?
-- Easier RLS:
-- "Anyone can update a lobby if guest_id is being set to auth.uid()"

create policy "Guests can join lobby." on lobbies
  for update
  using (true)
  with check ((guest_id = (select auth.uid())) OR (host_id = (select auth.uid())));
