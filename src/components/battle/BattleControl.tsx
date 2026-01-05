
import React from 'react';
import { BrutalButton } from '../ui/BrutalButton';
import { BrutalCard } from '../ui/BrutalCard';

interface Move {
    name: string;
    type?: string;
    pp?: number;
}

interface BattleControlProps {
    moves: Move[];
    onMoveClick: (moveIndex: number) => void;
    disabled: boolean;
}

export function BattleControl({ moves, onMoveClick, disabled }: BattleControlProps) {
    return (
        <BrutalCard className="h-[200px]">
            <div className="grid grid-cols-2 gap-4 h-full">
                {moves.map((move, idx) => (
                    <BrutalButton
                        key={idx}
                        onClick={() => onMoveClick(idx)} // 0-indexed for consistency
                        disabled={disabled}
                        variant="neutral"
                        className="h-full text-lg uppercase !shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-200"
                    >
                        {move.name || '-'}
                    </BrutalButton>
                ))}
                {/* Fill empty slots */}
                {Array.from({ length: 4 - moves.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-gray-200 border-4 border-black opacity-20"></div>
                ))}
            </div>
        </BrutalCard>
    );
}
