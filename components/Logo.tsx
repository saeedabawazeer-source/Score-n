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
                <pattern id="hexNet" x="0" y="0" width="20" height="34.64" patternUnits="userSpaceOnUse">
                    {/* Seamless "Y" tile that forms hexagons */}
                    <path d="M10 17.32 V0 M0 5.77 L10 11.55 L20 5.77" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 34.64 V17.32 M0 23.09 L10 28.87 L20 23.09" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </pattern>
            </defs>

            {/* The Net (Filled with Pattern) - Rectangular Post-to-Post */}
            <path
                d="M10 10 H90 V90 H10 V10Z"
                fill="url(#hexNet)"
            />

            {/* Goal Post Frame - Left Pole Extended Up, No Bottom Bar */}
            <path
                d="M10 0 V90 M10 10 H90 V90"
                stroke="#B4F156"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* 3D Depth Effect (Optional, adds a bit of the 'box' look from the reference if needed, keeping it simple 2D for now as per 'minimalist') */}
        </svg>
    );
};

