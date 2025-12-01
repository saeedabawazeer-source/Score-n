import React, { useEffect, useRef } from 'react';
import { NoiseLine, Point } from './LightningUtils';
import './ElectricBorder.css';

interface ElectricBorderProps {
    children: React.ReactNode;
    className?: string;
}

export const ElectricBorder: React.FC<ElectricBorderProps> = ({ children, className = '' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        // Initialize Noise Lines with EXACT parameters from snippet
        // baseLine: base: 10, amplitude: 0.6, speed: 0.02
        // lightningLine: base: 90, amplitude: 0.2, speed: 0.05
        // child: base: 60, amplitude: 0.8, speed: 0.08

        // We use 'lightningLine' as the main border effect
        // REDUCED AMPLITUDE (0.2 -> 0.1) for tighter path
        const lightning = new NoiseLine(16, { base: 90, amplitude: 0.1, speed: 0.05 });

        // Create 2 children as per snippet
        // REDUCED AMPLITUDE (0.8 -> 0.3)
        for (let i = 0; i < 2; i++) {
            lightning.createChild({ base: 60, amplitude: 0.3, speed: 0.08 });
        }

        const resize = () => {
            if (!canvas.parentElement) return;
            const rect = canvas.parentElement.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            ctx.scale(dpr, dpr);
        };

        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(canvas);

        // Color helper from snippet
        const H = 195;
        const S = 100;
        const L_MIN = 45;
        const L_MAX = 85;

        const setAlphaToString = (alpha?: number) => {
            const l = Math.random() * (L_MAX - L_MIN) + L_MIN;
            if (typeof alpha === 'undefined' || alpha === null) {
                return `hsl(${H}, ${S}%, ${l}%)`;
            }
            return `hsla(${H}, ${S}%, ${l}%, ${alpha})`;
        };

        const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const drawLightningLine = (line: NoiseLine, maxAlpha: number, minAlpha: number, maxLineW: number, minLineW: number) => {
            ctx.beginPath();
            ctx.strokeStyle = setAlphaToString(randomRange(minAlpha, maxAlpha));
            ctx.lineWidth = randomRange(minLineW, maxLineW);
            line.points.forEach((p, i) => {
                ctx[i === 0 ? 'moveTo' : 'lineTo'](p.x, p.y);
            });
            // Close loop for main bolt
            if (line === lightning && line.points.length > 0) {
                ctx.lineTo(line.points[0].x, line.points[0].y);
            }
            ctx.stroke();
        };

        const drawLightningBlur = (line: NoiseLine, blur: number, maxSize: number) => {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // This seems odd in snippet but kept for fidelity, though snippet uses shadowColor for the actual color
            ctx.shadowBlur = blur;
            ctx.shadowColor = setAlphaToString();
            ctx.beginPath();
            line.points.forEach((p, i) => {
                // Simplified blur logic from snippet (snippet used distance to neighbors)
                // We'll just draw circles at points
                const dist = maxSize; // Simplified
                ctx.moveTo(p.x + dist, p.y);
                ctx.arc(p.x, p.y, dist, 0, Math.PI * 2, false);
            });
            ctx.fill();
            ctx.restore();
        };

        const drawLightningCap = (line: NoiseLine) => {
            const points = line.points;
            for (let i = 0; i < points.length; i += points.length - 1) { // Start and end only? Snippet loop is weird: i += len - 1
                if (i >= points.length) break;
                const p = points[i];
                const radius = randomRange(2, 5); // Reduced cap radius (3-8 -> 2-5)
                const gradient = ctx.createRadialGradient(p.x, p.y, radius / 3, p.x, p.y, radius);
                gradient.addColorStop(0, setAlphaToString(1));
                gradient.addColorStop(1, setAlphaToString(0));
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2, false);
                ctx.fill();
            }
        };

        const draw = () => {
            if (!ctx || !canvas) return;

            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const p = 8; // Padding
            const r = 32; // Radius

            ctx.clearRect(0, 0, w, h);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Control Points (Visual Border)
            const controls = [
                new Point(p + r, p), new Point(w / 2, p), new Point(w - p - r, p),
                new Point(w - p, p + r), new Point(w - p, h / 2), new Point(w - p, h - p - r),
                new Point(w - p - r, h - p), new Point(w / 2, h - p), new Point(p + r, h - p),
                new Point(p, h - p - r), new Point(p, h / 2), new Point(p, p + r)
            ];

            // Update
            lightning.update(controls, true);

            // Draw Main Bolt
            // Snippet: drawLightningBlur(lightningLine, 50, 30);
            // Snippet: drawLightningLine(lightningLine, 0.75, 1, 1, 5);
            // Snippet: drawLightningCap(lightningLine);

            // REDUCED BLUR (50/30 -> 15/8)
            // REDUCED LINE WIDTH (1/5 -> 0.5/1.5)
            drawLightningBlur(lightning, 15, 8);
            drawLightningLine(lightning, 0.75, 1, 0.5, 1.5);
            drawLightningCap(lightning);

            // Draw Children
            lightning.children.forEach(child => {
                drawLightningLine(child, 0, 1, 0.2, 1);
                drawLightningBlur(child, 10, 5);
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return (
        <div className={`electric-border-wrapper relative w-full h-full ${className}`}>
            <div ref={containerRef} className="card-container relative w-full h-full">
                {/* Canvas Wrapper - Explicitly sized by CSS inset */}
                <div className="absolute inset-[-8px] pointer-events-none z-30">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full"
                        style={{ background: 'transparent' }}
                    />
                </div>

                <div className="inner-container">
                    {/* Static border fallback/background */}
                    <div className="border-outer opacity-30"></div>
                </div>

                <div className="absolute inset-0 z-20 overflow-visible">
                    {children}
                </div>
            </div>
        </div>
    );
};
