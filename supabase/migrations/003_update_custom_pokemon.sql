
-- Upgrade custom_pokemon table to support full competitive data
-- This prevents the "Proxy Trap" by allowing us to store and inject full species data

ALTER TABLE custom_pokemon
ADD COLUMN IF NOT EXISTS evs JSONB DEFAULT '{"hp": 0, "atk": 0, "def": 0, "spa": 0, "spd": 0, "spe": 0}'::jsonb,
ADD COLUMN IF NOT EXISTS ivs JSONB DEFAULT '{"hp": 31, "atk": 31, "def": 31, "spa": 31, "spd": 31, "spe": 31}'::jsonb,
ADD COLUMN IF NOT EXISTS nature TEXT DEFAULT 'Serious',
ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS shiny BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS item TEXT DEFAULT '';

-- Add constraint to ensure EVS/IVS are valid JSON objects (optional but good practice)
-- ALTER TABLE custom_pokemon ADD CONSTRAINT custom_pokemon_evs_check CHECK (jsonb_typeof(evs) = 'object');
-- ALTER TABLE custom_pokemon ADD CONSTRAINT custom_pokemon_ivs_check CHECK (jsonb_typeof(ivs) = 'object');
