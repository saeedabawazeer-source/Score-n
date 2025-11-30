import React from 'react';
import './AmbientGlowBorder.css';

interface AmbientGlowBorderProps {
    children: React.ReactNode;
    className?: string;
}

export const AmbientGlowBorder: React.FC<AmbientGlowBorderProps> = ({ children, className = '' }) => {
    return (
        <div className={`ambient-glow-wrapper relative w-full h-full ${className}`}>
            {/* Outer Glow (Behind everything) */}
            <div className="outer-glow-container">
                <div className="rotating-border"></div>
            </div>

            {/* Main Card Container */}
            <div className="glow-card">
                {/* Rotating Gradient Layer */}
                <div className="rotating-border"></div>

                {/* Content */}
                <div className="glow-inside">
                    {children}
                </div>
            </div>
        </div>
    );
};
