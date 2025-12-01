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

        // Initialize Noise Lines
        // We use a closed loop for the border
        const lightning = new NoiseLine(8, { base: 60, amplitude: 0.8, speed: 0.06 }); // Main bolt
        const lightning2 = new NoiseLine(8, { base: 40, amplitude: 0.5, speed: 0.04 }); // Secondary bolt

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

        const draw = () => {
            if (!ctx || !canvas) return;

            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const r = 36; // Radius

            ctx.clearRect(0, 0, w, h);

            // Define Control Points (The Rectangle Path)
            // We add intermediate points to help the spline follow the rounded rectangle shape better
            const controls = [
                new Point(r, 0),                // Top Left start
                new Point(w / 2, 0),              // Top Mid
                new Point(w - r, 0),            // Top Right end
                new Point(w, r),                // Right Top
                new Point(w, h / 2),              // Right Mid
                new Point(w, h - r),            // Right Bottom
                new Point(w - r, h),            // Bottom Right
                new Point(w / 2, h),              // Bottom Mid
                new Point(r, h),                // Bottom Left
                new Point(0, h - r),            // Left Bottom
                new Point(0, h / 2),              // Left Mid
                new Point(0, r)                 // Left Top
            ];

            // Update Lightning Logic
            lightning.update(controls, true); // true = closed loop
            lightning2.update(controls, true);

            // Drawing Helper
            const drawBolt = (line: NoiseLine, color: string, width: number, blur: number) => {
                ctx.beginPath();
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.shadowBlur = blur;
                ctx.shadowColor = color;

                if (line.points.length > 0) {
                    ctx.moveTo(line.points[0].x, line.points[0].y);
                    for (let i = 1; i < line.points.length; i++) {
                        ctx.lineTo(line.points[i].x, line.points[i].y);
                    }
                    // Close the loop
                    ctx.lineTo(line.points[0].x, line.points[0].y);
                }
                ctx.stroke();
            };

            // Draw Layers (Glow + Core)
            // Outer Glow
            drawBolt(lightning, 'rgba(221, 132, 72, 0.3)', 12, 20);

            // Inner Glow
            drawBolt(lightning, 'rgba(221, 132, 72, 0.8)', 4, 10);

            // White Core
            drawBolt(lightning, '#ffb380', 2, 0);

            // Secondary Bolt (Fainter, faster)
            drawBolt(lightning2, 'rgba(255, 255, 255, 0.4)', 1, 5);

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
