import React from 'react';
import './ElectricBorder.css';

interface ElectricBorderProps {
    children: React.ReactNode;
    className?: string;
}

export const ElectricBorder: React.FC<ElectricBorderProps> = ({ children, className = '' }) => {
    return (
        <div className={`electric-border-wrapper relative w-full h-full ${className}`}>
            <div className="card-container">
                {/* Electric Effect Layers */}
                <div className="electric-layer base-glow"></div>
                <div className="electric-layer jitter-border-1"></div>
                <div className="electric-layer jitter-border-2"></div>

                {/* Content */}
                <div className="relative z-20 w-full h-full rounded-[32px] overflow-hidden bg-[#0a0a0a]">
                    {children}
                </div>
            </div>
        </div>
    );
};
