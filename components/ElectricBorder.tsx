import React from 'react';
import './ElectricBorder.css';

interface ElectricBorderProps {
    children: React.ReactNode;
    className?: string;
}

export const ElectricBorder: React.FC<ElectricBorderProps> = ({ children, className = '' }) => {
    return (
        <div className={`electric-border-wrapper relative w-full h-full ${className}`}>
            {/* 
                Electric Lightning Animation 
                - Uses a tiled SVG background pattern for lightweight, mobile-safe animation.
                - No canvas, no heavy filters.
            */}
            <div className="electric-lightning-background"></div>

            {/* Static Glow for ambience */}
            <div className="electric-static-glow"></div>

            {/* Content Container - MUST be overflow-visible to allow player image to pop out */}
            <div className="relative z-10 w-full h-full overflow-visible">
                {children}
            </div>
        </div>
    );
};
