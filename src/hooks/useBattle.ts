
import { useState, useEffect, useRef } from 'react';
import { BattleSystem } from '@/lib/battle/engine';
import { useMultiplayerBattle } from './useMultiplayerBattle';
import { P1_TEAM_FULL, P2_TEAM_FULL } from '@/lib/battle/mockTeams';

export function useBattle(roomCode: string | null, role: 'p1' | 'p2' | 'spectator' | null, seed?: number[]) {
    const [engine] = useState(() => new BattleSystem(seed));
    const hasInitialized = useRef(false);

    // Battle State (Reactive)
    const [battleState, setBattleState] = useState({
        p1HP: 0,
        p1MaxHP: 100,
        p1Active: '',
        p2HP: 0,
        p2MaxHP: 100,
        p2Active: '',
        turnLog: [] as string[],
        turn: 0,
        activeMoves: [] as string[],
        phase: 'teampreview',
        p1TeamPreview: [] as string[],
        p2TeamPreview: [] as string[],
    });

    const { isConnected, lastReceivedMove, sendMove, sendStateHash, lastReceivedHash, desyncError: netDesyncError } = useMultiplayerBattle(roomCode || '', role || 'spectator');
    const [localDesync, setLocalDesync] = useState<string | null>(null);

    // Check Hash
    useEffect(() => {
        if (!lastReceivedHash) return;

        const localHash = engine.generateHash();
        const localTurn = engine.turn;

        if (lastReceivedHash.turn === localTurn) {
            if (lastReceivedHash.hash !== localHash) {
                console.error(`[SYNC] DESYNC DETECTED! Local: ${localHash}, Remote: ${lastReceivedHash.hash}`);
                setLocalDesync(`CRITICAL DESYNC: Turn ${localTurn}`);
            } else {
                console.log(`[SYNC] State Verified for Turn ${localTurn}`);
            }
        }
    }, [lastReceivedHash, engine]);

    // 1. Initialize Engine (Mock Data)
    useEffect(() => {
        if (hasInitialized.current) return;

        // Use Full Mock Teams
        engine.startBattle(P1_TEAM_FULL, P2_TEAM_FULL);
        hasInitialized.current = true;
        refreshState();
    }, [engine]);

    // 2. Handle Incoming Moves
    useEffect(() => {
        if (!lastReceivedMove) return;

        const { player, choice } = lastReceivedMove;
        if (player === 'p1' || player === 'p2') {
            engine.choose(player, choice);
            refreshState();
        }
    }, [lastReceivedMove, engine]);

    // 3. Sync State Helper
    const refreshState = () => {
        const p1 = engine.p1;
        const p2 = engine.p2;
        const p1Active = p1?.active?.[0];
        const p2Active = p2?.active?.[0];

        // Phase Detection
        let phase = 'combat';
        if (engine.turn === 0 && (!p1Active || !p1Active.hp)) {
            phase = 'teampreview';
        }

        // Check moves debugging
        const p1Moves = p1Active ? [...p1Active.moves] : [];
        const p2Moves = p2Active ? [...p2Active.moves] : [];

        setBattleState({
            p1HP: p1Active ? p1Active.hp : 0,
            p1MaxHP: p1Active ? p1Active.maxhp : 100,
            p1Active: p1Active ? p1Active.name : '',
            p2HP: p2Active ? p2Active.hp : 0,
            p2MaxHP: p2Active ? p2Active.maxhp : 100,
            p2Active: p2Active ? p2Active.name : '',
            turnLog: engine.log,
            turn: engine.turn,
            activeMoves: role === 'p1' ? p1Moves : role === 'p2' ? p2Moves : [],
            phase,
            p1TeamPreview: p1 ? p1.pokemon.map(p => p.species.name) : [],
            p2TeamPreview: p2 ? p2.pokemon.map(p => p.species.name) : [],
        });
    };

    // Helper to broadcast hash
    const broadcastHash = () => {
        const hash = engine.generateHash();
        const turn = engine.turn;
        console.log(`[useBattle] Broadcasting Hash: ${hash} for Turn ${turn}`);
        sendStateHash(hash, turn);
    }

    // 4. Send Move Wrapper
    const submitMove = (moveIndex: number) => {
        if (!role || role === 'spectator') return;

        const choice = `move ${moveIndex + 1}`;
        const currentTurn = engine.turn;

        console.log(`[useBattle] Sending Move: ${choice} for Turn ${currentTurn} as ${role}`);

        // Debug Move Order
        const moves = role === 'p1' ? engine.p1.active[0].moves : engine.p2.active[0].moves;
        console.log(`[useBattle] Active Moves for ${role}:`, moves);
        console.log(`[useBattle] Selected Index ${moveIndex} => ${moves[moveIndex]}`);

        sendMove(choice, currentTurn);
        engine.choose(role, choice);
        refreshState();
        broadcastHash();
    };

    const submitTeam = (teamOrder: string) => {
        if (!role || role === 'spectator') return;
        const choice = `team ${teamOrder}`;

        console.log(`[useBattle] Sending Team Order: ${choice}`);
        sendMove(choice, 0);
        engine.choose(role, choice);
        refreshState();
        broadcastHash();
    };

    const submitSwitch = (switchIndex: number) => {
        if (!role || role === 'spectator') return;

        const choice = `switch ${switchIndex + 1}`;
        const currentTurn = engine.turn;

        console.log(`[useBattle] Sending Switch: ${choice}`);
        sendMove(choice, currentTurn);
        engine.choose(role, choice);
        refreshState();
        broadcastHash();
    };

    return {
        battleState,
        isConnected,
        submitMove,
        submitTeam,
        submitSwitch,
        desyncError: netDesyncError || localDesync,
        engine,
    };
}
