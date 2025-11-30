import React from 'react';
import './ElectricBorder.css';

interface ElectricBorderProps {
    children: React.ReactNode;
    className?: string;
}

export const ElectricBorder: React.FC<ElectricBorderProps> = ({ children, className = '' }) => {
    const id = React.useId();
    const filterId = `turbulent-displace-${id.replace(/:/g, '')}`;

    // Refs for the feOffset elements we need to animate
    const offsetRef1 = React.useRef<SVGFEOffsetElement>(null);
    const offsetRef2 = React.useRef<SVGFEOffsetElement>(null);
    const offsetRef3 = React.useRef<SVGFEOffsetElement>(null);
    const offsetRef4 = React.useRef<SVGFEOffsetElement>(null);

    React.useEffect(() => {
        let frameId: number;
        const duration = 6000; // 6s duration from original CSS

        const animate = (time: number) => {
            // Calculate progress (0 to 1) based on time
            const progress = (time % duration) / duration;

            // 1. dy: 700 -> 0
            if (offsetRef1.current) {
                const val = 700 * (1 - progress);
                offsetRef1.current.setAttribute('dy', val.toString());
            }

            // 2. dy: 0 -> -700
            if (offsetRef2.current) {
                const val = -700 * progress;
                offsetRef2.current.setAttribute('dy', val.toString());
            }

            // 3. dx: 490 -> 0
            if (offsetRef3.current) {
                const val = 490 * (1 - progress);
                offsetRef3.current.setAttribute('dx', val.toString());
            }

            // 4. dx: 0 -> -490
            if (offsetRef4.current) {
                const val = -490 * progress;
                offsetRef4.current.setAttribute('dx', val.toString());
            }

            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div className={`electric-border-wrapper relative w-full h-full ${className}`}>
            {/* SVG Filter Definition */}
            <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
                        <feOffset ref={offsetRef1} in="noise1" dx="0" dy="0" result="offsetNoise1" />

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
                        <feOffset ref={offsetRef2} in="noise2" dx="0" dy="0" result="offsetNoise2" />

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="2" />
                        <feOffset ref={offsetRef3} in="noise1" dx="0" dy="0" result="offsetNoise3" />

                        <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
                        <feOffset ref={offsetRef4} in="noise2" dx="0" dy="0" result="offsetNoise4" />

                        <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
                        <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
                        <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

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
