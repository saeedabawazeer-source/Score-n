import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Hexagonal Net Pattern Definition */}
            <defs>
                <pattern id="hexNet" x="0" y="0" width="20" height="34.6" patternUnits="userSpaceOnUse">
                    <path d="M10 0 L20 5.77 V17.32 L10 23.09 L0 17.32 V5.77 L10 0Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                </pattern>
            </defs>

            {/* The Net (Filled with Pattern) */}
            <path
                d="M10 10 H90 V90 H10 V10Z"
                fill="url(#hexNet)"
            />

            {/* Goal Post Frame */}
            {/* Top Bar and Two Side Posts */}
            <path
                d="M10 90 V10 H90 V90"
                stroke="#B4F156"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* 3D Depth Effect (Optional, adds a bit of the 'box' look from the reference if needed, keeping it simple 2D for now as per 'minimalist') */}
        </svg>
    );
};
