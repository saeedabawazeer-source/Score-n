import React from 'react';
import './AmbientGlowBorder.css';

interface AmbientGlowBorderProps {
    children: React.ReactNode;
    className?: string;
}

export const AmbientGlowBorder: React.FC<AmbientGlowBorderProps> = ({ children, className = '' }) => {
    return (
        <div className={`ambient-glow-wrapper relative w-full h-full ${className}`}>
            <div className="glow-card">
                <div className="glow-inside">
                    {children}
                </div>
            </div>
        </div>
    );
};
