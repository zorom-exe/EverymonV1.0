
import React from 'react';
import { BrutalCard } from '@/components/ui/BrutalCard';

interface TeamPreviewProps {
    team: string[]; // List of species
    onSelectLead: (index: number) => void;
    opponentTeam?: string[];
    isWaiting?: boolean;
}

export function TeamPreview({ team, onSelectLead, opponentTeam, isWaiting }: TeamPreviewProps) {
    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-8 p-4 bg-[#fcfea3] items-center justify-center">

            {/* Opponent Preview (Hidden or Revealed depending on Gen) 
                 In Gen 9, we see the full opponent team. */}
            <BrutalCard className="w-full md:w-1/3 bg-red-200">
                <h2 className="text-xl font-bold mb-4 border-b-2 border-black">OPPONENT TEAM</h2>
                <div className="grid grid-cols-2 gap-2">
                    {opponentTeam?.map((mon, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 border-2 border-black bg-white">
                            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                            <span className="capitalize font-bold">{mon}</span>
                        </div>
                    ))}
                    {(!opponentTeam || opponentTeam.length === 0) && <div>Waiting for opponent...</div>}
                </div>
            </BrutalCard>

            {/* My Team */}
            <BrutalCard className="w-full md:w-1/3 bg-blue-200">
                <h2 className="text-xl font-bold mb-4 border-b-2 border-black">SELECT LEAD POKEMON</h2>
                <div className="grid grid-cols-1 gap-2">
                    {team.map((mon, i) => (
                        <button
                            key={i}
                            onClick={() => onSelectLead(i)}
                            disabled={isWaiting}
                            className={`p-4 border-2 border-black font-bold text-left transition-all
                                ${isWaiting ? 'bg-gray-400 cursor-not-allowed' : 'bg-white hover:bg-yellow-300 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
                            `}
                        >
                            {i + 1}. <span className="capitalize">{mon}</span>
                        </button>
                    ))}
                </div>
                {isWaiting && <div className="mt-4 font-bold text-center animate-pulse">WAITING FOR OPPONENT...</div>}
            </BrutalCard>

        </div>
    );
}
