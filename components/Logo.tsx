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
            {/* Manually Drawn Full Hexagons for "Complete" Look */}
            <g stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Row 1 */}
                <path d="M25 20 L32 24 V32 L25 36 L18 32 V24 Z" />
                <path d="M45 20 L52 24 V32 L45 36 L38 32 V24 Z" />
                <path d="M65 20 L72 24 V32 L65 36 L58 32 V24 Z" />
                <path d="M85 20 L92 24 V32 L85 36 L78 32 V24 Z" />

                {/* Row 2 */}
                <path d="M35 36 L42 40 V48 L35 52 L28 48 V40 Z" />
                <path d="M55 36 L62 40 V48 L55 52 L48 48 V40 Z" />
                <path d="M75 36 L82 40 V48 L75 52 L68 48 V40 Z" />

                {/* Row 3 */}
                <path d="M25 52 L32 56 V64 L25 68 L18 64 V56 Z" />
                <path d="M45 52 L52 56 V64 L45 68 L38 64 V56 Z" />
                <path d="M65 52 L72 56 V64 L65 68 L58 64 V56 Z" />
                <path d="M85 52 L92 56 V64 L85 68 L78 64 V56 Z" />

                {/* Row 4 */}
                <path d="M35 68 L42 72 V80 L35 84 L28 80 V72 Z" />
                <path d="M55 68 L62 72 V80 L55 84 L48 80 V72 Z" />
                <path d="M75 68 L82 72 V80 L75 84 L68 80 V72 Z" />
            </g>

            {/* The Net (Filled with Pattern) */}
            {/* The previous pattern fill is removed as per instruction to use manual hex grid */}

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

