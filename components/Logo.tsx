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
            {/* 7-Hex Connected Mesh (Honeycomb Cluster) */}
            <g stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Center Hex */}
                <path d="M50 40 L58.66 45 V55 L50 60 L41.34 55 V45 Z" />

                {/* Top Hex */}
                <path d="M50 20 L58.66 25 V35 L50 40 L41.34 35 V25 Z" />

                {/* Top Right Hex */}
                <path d="M67.32 30 L75.98 35 V45 L67.32 50 L58.66 45 V35 Z" />

                {/* Bottom Right Hex */}
                <path d="M67.32 50 L75.98 55 V65 L67.32 70 L58.66 65 V55 Z" />

                {/* Bottom Hex */}
                <path d="M50 60 L58.66 65 V75 L50 80 L41.34 75 V65 Z" />

                {/* Bottom Left Hex */}
                <path d="M32.68 50 L41.34 55 V65 L32.68 70 L24.02 65 V55 Z" />

                {/* Top Left Hex */}
                <path d="M32.68 30 L41.34 35 V45 L32.68 50 L24.02 45 V35 Z" />
            </g>

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

