
-- Add seed column to lobbies table
-- Random seed for PKMN engine (array of 4 numbers usually, but we can store as array or string)
-- Sim expects number[4]. We can store as numeric array.

ALTER TABLE lobbies 
ADD COLUMN seed numeric[] DEFAULT ARRAY[floor(random() * 10000), floor(random() * 10000), floor(random() * 10000), floor(random() * 10000)];

COMMENT ON COLUMN lobbies.seed IS 'Random seed for deterministic battle simulation';
