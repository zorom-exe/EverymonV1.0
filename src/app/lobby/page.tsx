
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLobby } from '@/hooks/useLobby';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export default function LobbyPage() {
    const router = useRouter();
    const { lobby, createLobby, joinLobby, error } = useLobby();
    // const lobby: any = null;
    // const createLobby = async (id: string) => { };
    // const joinLobby = async (id: string, c: string) => { };
    // const error: string | null = null;
    const [joinCode, setJoinCode] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [supabaseInitError, setSupabaseInitError] = useState(false);

    // Auth Check (Strict: You must be logged in to play)
    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            if (!supabase) {
                console.warn("Supabase client not initialized (missing env?)");
                setSupabaseInitError(true);
                return;
            }
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            } else {
                // For dev MVP, we might want to auto-sign in anonymously?
                // "Agent Rules: User updates own profile". 
                // We'll assume the user handles auth elsewhere or we can make a dummy auth button.
                // Let's add a "Sign In with Random ID" for testing if no user.
                const { data: anon } = await supabase.auth.signInAnonymously();
                if (anon.user) setUserId(anon.user.id);
            }
        };
        checkAuth();
    }, []);

    // Redirect when battle starts
    useEffect(() => {
        if (lobby?.state === 'battling') {
            router.push(`/battle?room=${lobby.code}`);
        }
    }, [lobby?.state, lobby?.code, router]);

    const handleCreate = async () => {
        if (!userId) return;
        await createLobby(userId);
    };

    const handleJoin = async () => {
        if (!userId || !joinCode) return;
        await joinLobby(userId, joinCode.toUpperCase());
    };

    if (supabaseInitError) {
        return (
            <div className="min-h-screen bg-red-500 p-8 font-mono text-white">
                <h1 className="text-4xl font-black mb-4">CONFIGURATION ERROR</h1>
                <p className="text-xl font-bold mb-4">Supabase Client failed to initialize.</p>
                <div className="bg-black p-4 border-4 border-white">
                    <p>Please check your browser console (F12) for details.</p>
                    <p>Ensure .env.local has valid NEXT_PUBLIC_SUPABASE_URL</p>
                </div>
            </div>
        );
    }

    if (!userId) return <div className="p-8 font-bold">Authenticating...</div>;

    return (
        <div className="min-h-screen bg-yellow-400 p-8 font-mono text-black">
            <div className="max-w-md mx-auto bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-3xl font-black mb-6 uppercase tracking-tighter">Everymon Arcade</h1>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 bg-red-500 text-white p-2 border-2 border-black font-bold">
                        ERROR: {error}
                    </div>
                )}

                {/* Lobby State Display */}
                {lobby ? (
                    <div className="text-center space-y-4">
                        <div className="text-sm font-bold">ROOM CODE</div>
                        <div className="text-6xl font-black tracking-widest">{lobby.code}</div>

                        <div className="py-4">
                            {lobby.guest_id ? (
                                <div className="text-green-600 font-bold animate-pulse">PLAYER 2 JOINED!</div>
                            ) : (
                                <div className="text-gray-500 font-bold animate-bounce">WAITING FOR CHALLENGER...</div>
                            )}
                        </div>

                        <div className="text-xs text-gray-400">
                            Share this code with a friend.
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <button
                            onClick={handleCreate}
                            className="w-full bg-cyan-400 p-4 border-4 border-black font-bold text-xl hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            CREATE LOBBY
                        </button>

                        <div className="flex items-center gap-2">
                            <div className="h-0.5 bg-black flex-1"></div>
                            <span className="font-bold">OR</span>
                            <div className="h-0.5 bg-black flex-1"></div>
                        </div>

                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="ENTER CODE (e.g. XJ9Z)"
                                className="w-full p-3 border-4 border-black font-bold text-lg focus:outline-none focus:bg-pink-100"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                maxLength={4}
                            />
                            <button
                                onClick={handleJoin}
                                className="w-full bg-pink-500 text-white p-4 border-4 border-black font-bold text-xl hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                JOIN LOBBY
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
