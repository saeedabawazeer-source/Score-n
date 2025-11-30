import React from 'react';
import './AmbientGlowBorder.css';

interface AmbientGlowBorderProps {
    children: React.ReactNode;
    className?: string;
    color1?: string;
    color2?: string;
}

export const AmbientGlowBorder: React.FC<AmbientGlowBorderProps> = ({
    children,
    className = '',
    color1 = '#00ffc3', // Default Cyan
    color2 = '#a94cff'  // Default Purple
}) => {
    return (
        <div
            className={`ambient-glow-wrapper relative w-full h-full ${className}`}
            style={{
                '--glow-color-1': color1,
                '--glow-color-2': color2
            } as React.CSSProperties}
        >
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
