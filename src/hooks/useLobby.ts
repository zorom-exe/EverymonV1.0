
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

type LobbyRow = Database['public']['Tables']['lobbies']['Row'];

export function useLobby() {
    const [supabase] = useState(() => createClient());
    const [lobby, setLobby] = useState<LobbyRow | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Create a new lobby
    const createLobby = async (userId: string) => {
        if (!supabase) return null;
        // Generate a simple 4-char code
        const code = Math.random().toString(36).substring(2, 6).toUpperCase();

        const { data, error } = await supabase
            .from('lobbies')
            .insert({
                code,
                host_id: userId,
                state: 'waiting',
            })
            .select()
            .single();

        if (error) {
            setError(error.message);
            return null;
        }
        setLobby(data);
        return data;
    };

    // Join an existing lobby
    const joinLobby = async (userId: string, code: string) => {
        if (!supabase) return null;

        // 1. Fetch lobby to see if it exists and is waiting
        const { data: existing, error: fetchError } = await supabase
            .from('lobbies')
            .select()
            .eq('code', code)
            .single();

        if (fetchError || !existing) {
            setError('Lobby not found');
            return null;
        }

        console.log("JOIN ATTEMPT DEBUG: ", existing);

        if (existing.state !== 'waiting') {
            console.error("LOBBY BUSY: State is", existing.state);
            setError('Lobby is busy');
            return null;
        }

        if (existing.host_id === userId) {
            // Re-joining own lobby
            setLobby(existing);
            return existing;
        }

        // 2. Update lobby with guest_id
        // Now that we have guest_id in the schema, we can properly join
        const { data: updated, error: updateError } = await supabase
            .from('lobbies')
            .update({ guest_id: userId, state: 'battling' })
            .eq('code', code)
            // Ensure we don't overwrite if someone else joined in the last millisecond
            .is('guest_id', null)
            .select()
            .single();

        if (updateError || !updated) {
            setError(updateError ? updateError.message : 'Failed to join: Lobby full or invalid');
            return null;
        }

        setLobby(updated);
        return updated;
    };

    // Subscribe to changes
    useEffect(() => {
        if (!lobby || !supabase) return;

        const channel = supabase
            .channel(`lobby:${lobby.code}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'lobbies',
                    filter: `code=eq.${lobby.code}`,
                },
                (payload) => {
                    setLobby(payload.new as LobbyRow);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [lobby?.code]);

    return { lobby, createLobby, joinLobby, error };
}
