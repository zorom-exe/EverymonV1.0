
import { Species } from '@pkmn/sim';
import { Database } from '@/types/supabase';

// Define the shape of our Custom Pokemon from the DB
// We use a simplified version of the row for the adapter
export type CustomPokemonRow = Database['public']['Tables']['custom_pokemon']['Row'];

// Extended interface required by the Engine's ModdedDex
// The engine expects Species to have specific fields. 
// We return a Partial<Species> that covers the mandatory ones for a battle to work.
export function convertToSpecies(customMon: CustomPokemonRow): Partial<Species> {
    const stats = customMon.stats as { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };

    return {
        name: customMon.name,
        id: customMon.name.toLowerCase().replace(/[^a-z0-9]/g, '') as any, // strict ID sanitization
        types: customMon.types,
        baseStats: {
            hp: stats.hp,
            atk: stats.atk,
            def: stats.def,
            spa: stats.spa,
            spd: stats.spd,
            spe: stats.spe,
        },
        abilities: { 0: customMon.ability },
        // Standard validation flags for the engine
        num: -1, // Custom mons have negative IDs to avoid dex collisions
        gen: 9,
        exists: true,
    };
}
