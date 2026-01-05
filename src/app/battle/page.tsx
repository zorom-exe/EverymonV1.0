
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BattleCanvas } from '@/components/battle/BattleCanvas';
import { BattleControl } from '@/components/battle/BattleControl';
import { TeamPreview } from '@/components/battle/TeamPreview';
import { SwitchMenu } from '@/components/battle/SwitchMenu';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { useBattle } from '@/hooks/useBattle';

export const dynamic = 'force-dynamic';

function BattleContent() {
    const searchParams = useSearchParams();
    const roomCode = searchParams.get('room');
    const [role, setRole] = useState<'p1' | 'p2' | 'spectator' | null>(null);

    // 1. Determine Role
    useEffect(() => {
        const fetchRole = async () => {
            if (!roomCode) return;
            const supabase = createClient();
            if (!supabase) return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: lobby } = await supabase
                .from('lobbies')
                .select()
                .eq('code', roomCode)
                .single();

            if (lobby) {
                if (lobby.host_id === user.id) setRole('p1');
                else if (lobby.guest_id === user.id) setRole('p2');
                else setRole('spectator');

                if (lobby.seed) setSeed(lobby.seed);
            }
        };
        fetchRole();
    }, [roomCode]);

    const [seed, setSeed] = useState<number[] | undefined>(undefined);

    // 2. Use Hook
    // Only init battle when seed is found (or if we decide to allow random fallback)
    // Actually useBattle state is lazy, but we want to pass seed from start.
    // For now we pass seed, but if it's undefined internal engine might random. 
    // BUT we need it synced. So we should arguably wait for seed.

    // We can conditionally render or just pass it. State update will re-trigger?
    // No, useState(() => new BattleSystem()) runs ONCE.
    // So we must key the hook or component on seed presence.

    if (!seed && roomCode) return <div className="p-4 font-mono font-bold">SYNCING BATTLE STATE...</div>;

    return <BattleInner roomCode={roomCode} role={role} seed={seed} />;
}

// Wrapper to allow hooks to init with seed
function BattleInner({ roomCode, role, seed }: { roomCode: string | null, role: 'p1' | 'p2' | 'spectator' | null, seed?: number[] }) {
    const { battleState, isConnected, submitMove, submitTeam, submitSwitch } = useBattle(roomCode, role, seed);

    const [selectedMoveIndex, setSelectedMoveIndex] = useState<number | null>(null);
    const [showSwitchMenu, setShowSwitchMenu] = useState(false);

    // Reset selection on new turn
    useEffect(() => {
        setSelectedMoveIndex(null);
    }, [battleState.turn]);

    const handleMoveClick = (index: number) => {
        setSelectedMoveIndex(index);
        submitMove(index);
    };

    const handleSwitchClick = (index: number) => {
        // index is the party slot index (0-5)
        setSelectedMoveIndex(999); // Lock UI
        submitSwitch(index);
        setShowSwitchMenu(false);
    };

    const handleLeadSelect = (index: number) => {
        // Simple Logic: just swap 1 with selected index.
        // Actually Sim expects string of chars '123456'.
        // If index is 2 (3rd mon), we want it first but we need to map based on 1-index.

        const myTeam = ['1', '2', '3', '4', '5', '6'];
        const picked = myTeam[index];
        const rest = myTeam.filter((_, i) => i !== index);
        const order = [picked, ...rest].join('');

        submitTeam(order);
    };

    return (
        <div className="h-screen w-full bg-[#fcfea3] p-4 flex flex-col font-mono">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="bg-black text-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                    EVERYMON PROTOCOL
                </div>
                <div className={`px-4 py-2 font-bold border-2 border-black ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}>
                    STATUS: {isConnected ? 'SYNCED' : 'OFFLINE'}
                </div>
            </div>

            {/* Battle Area */}
            {battleState.phase === 'teampreview' ? (
                <div className="flex-1 mb-4 relative">
                    <TeamPreview
                        team={role === 'p1' ? battleState.p1TeamPreview : battleState.p2TeamPreview}
                        opponentTeam={role === 'p1' ? battleState.p2TeamPreview : battleState.p1TeamPreview}
                        onSelectLead={handleLeadSelect}
                        isWaiting={false} // Todo: track if waiting for opp
                    />
                </div>
            ) : (
                <div className="flex h-full flex-col">
                    {/* Battle Canvas */}
                    <div className="flex-1 mb-4 relative">
                        <BattleCanvas
                            p1Name={role === 'p1' ? 'You' : 'Player 1'}
                            p2Name={role === 'p2' ? 'You' : 'Player 2'}
                            p1HP={battleState.p1HP}
                            p1MaxHP={battleState.p1MaxHP}
                            p2HP={battleState.p2HP}
                            p2MaxHP={battleState.p2MaxHP}
                            p1Sprite={battleState.p1Active || 'substitute'}
                            p2Sprite={battleState.p2Active || 'substitute'}
                        />
                    </div>

                    {/* Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[200px] relative">
                        {/* Waiting Overlay */}
                        {selectedMoveIndex !== null && (
                            <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm border-4 border-white animate-pulse">
                                WAITING FOR OPPONENT...
                            </div>
                        )}

                        {/* Log */}
                        <div className="md:col-span-1 h-full">
                            <BrutalCard className="h-full overflow-y-auto text-xs flex flex-col-reverse">
                                <div>
                                    <div className="font-bold mb-2 border-b-2 border-black sticky top-0 bg-white">
                                        BATTLE LOG (Turn {battleState.turn})
                                    </div>
                                    {battleState.turnLog.map((line, i) => (
                                        <div key={i} className="mb-1 border-l-2 border-gray-300 pl-2">
                                            {line}
                                        </div>
                                    ))}
                                </div>
                            </BrutalCard>
                        </div>

                        {/* Move Menu */}
                        <div className="md:col-span-2 h-full">
                            {role && role !== 'spectator' ? (
                                showSwitchMenu ? (
                                    <SwitchMenu
                                        team={role === 'p1' ? battleState.p1TeamPreview : battleState.p2TeamPreview}
                                        activeName={role === 'p1' ? battleState.p1Active : battleState.p2Active}
                                        onSwitch={handleSwitchClick}
                                        disabled={!isConnected || selectedMoveIndex !== null}
                                        onCancel={() => setShowSwitchMenu(false)}
                                    />
                                ) : (
                                    <div className="h-full flex gap-2">
                                        <div className="flex-1">
                                            <BattleControl
                                                moves={battleState.activeMoves.map(m => ({ name: m }))}
                                                onMoveClick={handleMoveClick}
                                                disabled={!isConnected || selectedMoveIndex !== null}
                                            />
                                        </div>
                                        <div className="w-1/4">
                                            <button
                                                onClick={() => setShowSwitchMenu(true)}
                                                disabled={!isConnected || selectedMoveIndex !== null}
                                                className="w-full h-full bg-blue-400 border-4 border-black font-bold hover:bg-blue-300 disabled:opacity-50"
                                            >
                                                SWITCH
                                            </button>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <BrutalCard className="h-full flex items-center justify-center font-bold text-gray-400 uppercase">
                                    Spectator Mode
                                </BrutalCard>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function BattlePage() {
    return (
        <Suspense fallback={<div>Loading Arena...</div>}>
            <BattleContent />
        </Suspense>
    );
}
