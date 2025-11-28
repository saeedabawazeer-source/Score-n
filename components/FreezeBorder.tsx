import React from 'react';
import './FreezeBorder.css';

interface FreezeBorderProps {
    children: React.ReactNode;
    className?: string;
}

export const FreezeBorder: React.FC<FreezeBorderProps> = ({ children, className = '' }) => {
    return (
        <div className={`freeze-border-wrapper relative w-full h-full ${className}`}>
            {/* SVG Filter for Freeze Animation */}
            <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
                <defs>
                    <filter id="freeze-turbulence" x="-50%" y="-50%" width="200%" height="200%">
                        {/* Ice crystal turbulence - slower than electric */}
                        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="turb1" seed="10" />
                        <feOffset in="turb1" dx="0" dy="0" result="offsetTurb1">
                            <animate attributeName="dy" values="50; 0" dur="15s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="turb2" seed="10" />
                        <feOffset in="turb2" dx="0" dy="0" result="offsetTurb2">
                            <animate attributeName="dy" values="0; -50" dur="15s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="turb3" seed="11" />
                        <feOffset in="turb3" dx="0" dy="0" result="offsetTurb3">
                            <animate attributeName="dx" values="30; 0" dur="15s" repeatCount="indefinite" calcMode="linear" />
                        </feOffset>

                        <feComposite in="offsetTurb1" in2="offsetTurb2" result="part1" />
                        <feBlend in="part1" in2="offsetTurb3" mode="lighten" result="combinedTurb" />

                        <feDisplacementMap in="SourceGraphic" in2="combinedTurb" scale="12" xChannelSelector="R" yChannelSelector="B" />
                    </filter>
                </defs>
            </svg>

            <div className="card-container">
                <div className="inner-container">
                    <div className="border-outer">
                        <div className="main-card-border"></div>
                    </div>
                    <div className="glow-layer-1"></div>
                    <div className="glow-layer-2"></div>
                </div>

                <div className="overlay-1"></div>
                <div className="background-glow"></div>

                {/* Card wrapper with background */}
                <div className="absolute inset-0 rounded-[32px] p-[2px] bg-gradient-to-b from-[#333] via-[#222] to-lime/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-visible z-20">
                    {children}
                </div>
            </div>
        </div>
    );
};
