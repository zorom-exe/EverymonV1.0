
import React from 'react';
import { BrutalCard } from '../ui/BrutalCard';

interface BattleCanvasProps {
    p1Name: string;
    p2Name: string;
    p1HP: number; // Current HP
    p1MaxHP: number;
    p2HP: number;
    p2MaxHP: number;
    p1Sprite?: string;
    p2Sprite?: string;
}

function HPBar({ current, max, isPlayer }: { current: number; max: number; isPlayer: boolean }) {
    const percentage = Math.max(0, Math.min(100, (current / max) * 100));

    // Color logic
    let color = 'bg-green-500';
    if (percentage < 50) color = 'bg-yellow-500';
    if (percentage < 20) color = 'bg-red-500';

    return (
        <div className={`w-full border-4 border-black h-8 bg-gray-200 relative ${isPlayer ? 'origin-right' : 'origin-left'}`}>
            <div
                className={`h-full ${color} transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
            />
            <div className="absolute top-0 right-1 text-xs font-bold leading-none mt-1">
                {current}/{max}
            </div>
        </div>
    );
}

export function BattleCanvas({ p1Name, p2Name, p1HP, p1MaxHP, p2HP, p2MaxHP }: BattleCanvasProps) {
    return (
        <div className="relative w-full h-[400px] bg-sky-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-6">

            {/* Floor / Terrain */}
            <div className="absolute bottom-0 w-full h-1/3 bg-[#70A465] border-t-4 border-black"></div>

            {/* Opponent (Top Right) */}
            <div className="absolute top-8 right-8 w-64">
                <BrutalCard className="mb-2 !p-2">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold truncate">{p2Name}</span>
                        <span className="text-xs">Lv. 50</span>
                    </div>
                    <HPBar current={p2HP} max={p2MaxHP} isPlayer={false} />
                </BrutalCard>
                <div className="flex justify-center mt-4">
                    {/* Placeholder Sprite (Circle) */}
                    <div className="w-24 h-24 rounded-full bg-red-400 border-4 border-black animate-bounce shadow-xl"></div>
                </div>
            </div>

            {/* Player (Bottom Left) */}
            <div className="absolute bottom-12 left-8 w-64">
                <div className="flex justify-center mb-4 z-10 relative">
                    {/* Placeholder Sprite (Back) */}
                    <div className="w-32 h-32 rounded-full bg-blue-400 border-4 border-black shadow-xl"></div>
                </div>
                <BrutalCard className="!p-2">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold truncate">{p1Name}</span>
                        <span className="text-xs">Lv. 50</span>
                    </div>
                    <HPBar current={p1HP} max={p1MaxHP} isPlayer={true} />
                </BrutalCard>
            </div>

        </div>
    );
}
