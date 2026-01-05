
import React from 'react';
import { BrutalCard } from '../ui/BrutalCard';

interface SwitchMenuProps {
    team: string[]; // List of species names
    activeName: string; // Current active mon name
    onSwitch: (index: number) => void; // index in the team array
    disabled: boolean;
    onCancel: () => void;
}

export function SwitchMenu({ team, activeName, onSwitch, disabled, onCancel }: SwitchMenuProps) {
    return (
        <BrutalCard className="h-full bg-blue-200">
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-1">
                    <span className="font-bold">SWITCH POKEMON</span>
                    <button onClick={onCancel} className="text-xs hover:underline bg-red-400 px-2 py-1 border border-black">CANCEL</button>
                </div>
                <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto">
                    {team.map((mon, i) => {
                        // Check strict index if possible, but name matching is OK for MVP
                        // We assume activeName is passed down 
                        const isActive = mon === activeName;

                        return (
                            <button
                                key={i}
                                onClick={() => onSwitch(i)}
                                disabled={disabled || isActive}
                                className={`p-2 border-2 border-black text-left font-bold text-sm
                                    ${isActive ? 'bg-gray-400 cursor-default opacity-50' : 'bg-white hover:bg-yellow-300'}
                                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {i + 1}. {mon}
                                {isActive && ' (Active)'}
                            </button>
                        );
                    })}
                </div>
            </div>
        </BrutalCard>
    );
}
