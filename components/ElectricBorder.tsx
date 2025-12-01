import React from 'react';
import './ElectricBorder.css';

interface ElectricBorderProps {
    children: React.ReactNode;
    className?: string;
}

export const ElectricBorder: React.FC<ElectricBorderProps> = ({ children, className = '' }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            // Measure the canvas element itself (sized by CSS inset)
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            // Do NOT set style.width/height, let CSS handle layout

            ctx.scale(dpr, dpr);
        };

        // Initial resize
        resize();

        // Resize observer
        const observer = new ResizeObserver(resize);
        observer.observe(canvas); // Observe canvas instead of container

        const drawLightning = () => {
            if (!ctx || !canvas) return;

            const rect = canvas.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const radius = 36; // 32px (card) + 4px (padding) for concentric corners

            ctx.clearRect(0, 0, width, height);

            // Style
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Draw multiple layers for glow effect
            const layers = [
                { color: 'rgba(221, 132, 72, 0.2)', width: 8, blur: 10 },
                { color: 'rgba(221, 132, 72, 0.6)', width: 4, blur: 4 },
                { color: '#ffb380', width: 2, blur: 0 }
            ];

            layers.forEach(layer => {
                ctx.beginPath();
                ctx.strokeStyle = layer.color;
                ctx.lineWidth = layer.width;
                ctx.shadowBlur = layer.blur;
                ctx.shadowColor = layer.color;

                // Path walking function
                const step = 5; // Resolution of distortion

                // Noise function: Sum of sines for flowing "electric" look
                const getNoise = (offset: number) => {
                    return (
                        Math.sin(offset * 0.05 + time * 0.002) * 2 +
                        Math.sin(offset * 0.1 + time * 0.005) * 1 +
                        Math.random() * 0.5
                    );
                };

                // Top Edge
                for (let x = radius; x <= width - radius; x += step) {
                    const noise = getNoise(x);
                    ctx.lineTo(x, 0 + noise);
                }

                // Top-Right Corner (simplified)
                ctx.quadraticCurveTo(width + getNoise(width), 0 + getNoise(0), width + getNoise(width), radius + getNoise(radius));

                // Right Edge
                for (let y = radius; y <= height - radius; y += step) {
                    const noise = getNoise(y + width); // Offset phase
                    ctx.lineTo(width + noise, y);
                }

                // Bottom-Right Corner
                ctx.quadraticCurveTo(width + getNoise(width), height + getNoise(height), width - radius + getNoise(width), height + getNoise(height));

                // Bottom Edge
                for (let x = width - radius; x >= radius; x -= step) {
                    const noise = getNoise(x + width + height);
                    ctx.lineTo(x, height + noise);
                }

                // Bottom-Left Corner
                ctx.quadraticCurveTo(0 + getNoise(0), height + getNoise(height), 0 + getNoise(0), height - radius + getNoise(height));

                // Left Edge
                for (let y = height - radius; y >= radius; y -= step) {
                    const noise = getNoise(y + width + height + width);
                    ctx.lineTo(0 + noise, y);
                }

                // Top-Left Corner
                ctx.quadraticCurveTo(0 + getNoise(0), 0 + getNoise(0), radius + getNoise(radius), 0 + getNoise(0));

                ctx.closePath();
                ctx.stroke();
            });

            time += 16; // Advance time
            animationFrameId = requestAnimationFrame(drawLightning);
        };

        drawLightning();

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return (
        <div className={`electric-border-wrapper relative w-full h-full ${className}`}>
            <div ref={containerRef} className="card-container relative">
                {/* Canvas Overlay for Electric Border */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-[-4px] pointer-events-none z-30"
                />

                <div className="inner-container">
                    {/* Static border fallback/background */}
                    <div className="border-outer opacity-50"></div>
                    <div className="glow-layer-1"></div>
                </div>

                <div className="overlay-1"></div>
                <div className="background-glow"></div>

                <div className="absolute inset-0 z-20">
                    {children}
                </div>
            </div>
        </div>
    );
};
