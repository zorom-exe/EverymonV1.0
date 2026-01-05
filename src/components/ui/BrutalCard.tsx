
import React from 'react';

interface BrutalCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function BrutalCard({ children, className = '', title }: BrutalCardProps) {
    return (
        <div className={`bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 ${className}`}>
            {title && (
                <div className="border-b-4 border-black pb-2 mb-4">
                    <h2 className="font-black text-xl uppercase tracking-tighter">{title}</h2>
                </div>
            )}
            {children}
        </div>
    );
}
