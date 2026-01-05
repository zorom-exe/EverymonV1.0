
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'neutral';

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

export function BrutalButton({
    children,
    variant = 'primary',
    className = '',
    disabled,
    ...props
}: BrutalButtonProps) {

    const baseStyles = "font-mono font-bold border-4 border-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

    const variants = {
        primary: "bg-yellow-400 hover:bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        secondary: "bg-cyan-400 hover:bg-cyan-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        danger: "bg-pink-500 text-white hover:bg-pink-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        neutral: "bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className} p-3`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
