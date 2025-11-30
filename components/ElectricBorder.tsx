import React from 'react';
import './ElectricBorder.css';

interface ElectricBorderProps {
    children: React.ReactNode;
    className?: string;
}

export const ElectricBorder: React.FC<ElectricBorderProps> = ({ children, className = '' }) => {
    const id = React.useId();
    const filterId = `turbulent-displace-${id.replace(/:/g, '')}`;
    const turbulenceRef1 = React.useRef<SVGFETurbulenceElement>(null);
    const turbulenceRef2 = React.useRef<SVGFETurbulenceElement>(null);

    React.useEffect(() => {
        let frameId: number;
        let lastTime = 0;
        const fps = 15; // Limit to 15fps for a "crackling" look, not "epileptic"
        const interval = 1000 / fps;

        const animate = (time: number) => {
            if (time - lastTime > interval) {
                lastTime = time;
                // Randomize seeds to create crackling effect
                if (turbulenceRef1.current) {
                    turbulenceRef1.current.setAttribute('seed', Math.floor(Math.random() * 100).toString());
                }
                if (turbulenceRef2.current) {
                    turbulenceRef2.current.setAttribute('seed', Math.floor(Math.random() * 100).toString());
                }
            }
            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div className={`electric-border-wrapper relative w-full h-full ${className}`}>
            {/* SVG Filter Definition - 1px size to prevent culling on mobile */}
            <svg className="absolute top-0 left-0 w-[1px] h-[1px] overflow-hidden pointer-events-none" aria-hidden="true" style={{ opacity: 0 }}>
                <defs>
                    <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                        {/* Animate seeds via JS */}
                        <feTurbulence ref={turbulenceRef1} type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
                        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1" />

                        <feTurbulence ref={turbulenceRef2} type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
                        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2" />

                        <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
                        <feBlend in="part1" mode="color-dodge" result="combinedNoise" />

                        <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
                    </filter>
                </defs>
            </svg>

            <div className="card-container">
                <div className="inner-container">
                    <div className="border-outer">
                        <div className="main-card-border" style={{ filter: `url(#${filterId})` }}></div>
                    </div>
                    <div className="glow-layer-1"></div>
                    <div className="glow-layer-2"></div>
                </div>

                <div className="overlay-1"></div>
                <div className="overlay-2"></div>
                <div className="background-glow"></div>

                <div className="absolute inset-0 z-20">
                    {children}
                </div>
            </div>
        </div>
    );
};
