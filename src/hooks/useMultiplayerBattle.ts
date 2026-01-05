
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type BattleMove = {
    player: 'p1' | 'p2';
    choice: string; // "move 1", "switch 2", etc.
    turn: number;
};

export function useMultiplayerBattle(lobbyCode: string, playerRole: 'p1' | 'p2' | 'spectator') {
    const supabase = createClient();
    const channelRef = useRef<RealtimeChannel | null>(null);

    const [lastReceivedMove, setLastReceivedMove] = useState<BattleMove | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [desyncError, setDesyncError] = useState<string | null>(null);

    useEffect(() => {
        if (!lobbyCode || !supabase) return;

        // Join the Broadcast Channel for this room
        const channel = supabase.channel(`battle:${lobbyCode}`, {
            config: {
                broadcast: { self: false },
            },
        });

        channel
            .on('broadcast', { event: 'player_move' }, ({ payload }) => {
                console.log(`[NET] RX Move from ${payload.player}:`, payload);
                setLastReceivedMove(payload as BattleMove);
            })
            .on('broadcast', { event: 'sync_state' }, ({ payload }) => {
                console.log(`[NET] RX Hash form ${payload.player}:`, payload);
                if (payload.player !== playerRole) {
                    setLastReceivedHash({ hash: payload.hash, turn: payload.turn });
                }
            })
            .subscribe((status) => {
                console.log(`[NET] Channel Status: ${status}`);
                if (status === 'SUBSCRIBED') {
                    setIsConnected(true);
                }
            });

        channelRef.current = channel;

        return () => {
            console.log('[NET] Disconnecting channel...');
            supabase.removeChannel(channel);
            channelRef.current = null;
        };
    }, [lobbyCode]);

    // Function to broadcast my move to the opponent
    const sendMove = (choice: string, turn: number) => {
        if (!channelRef.current || !isConnected) {
            console.warn('[NET] Cannot send move: Not connected or channel missing');
            return;
        }
        if (playerRole === 'spectator') return;

        const payload: BattleMove = {
            player: playerRole,
            choice,
            turn,
        };

        console.log(`[NET] TX Move as ${playerRole}:`, payload);

        channelRef.current.send({
            type: 'broadcast',
            event: 'player_move',
            payload,
        }).then((resp) => {
            console.log('[NET] TX Acknowledged:', resp);
        });
    };

    // Function to broadcast state hash (for verification)
    const sendStateHash = (hash: string, turn: number) => {
        if (!channelRef.current || !isConnected) return;
        channelRef.current.send({
            type: 'broadcast',
            event: 'sync_state',
            payload: { player: playerRole, hash, turn },
        });
    };



    const [lastReceivedHash, setLastReceivedHash] = useState<{ hash: string, turn: number } | null>(null);

    return {
        isConnected,
        lastReceivedMove,
        sendMove,
        sendStateHash,
        lastReceivedHash, // Expose this
        desyncError,
    };
}
