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
        // Reduced speed and amplitude for a "thinner, slower" look
        const lightning = new NoiseLine(8, { base: 60, amplitude: 0.3, speed: 0.02 }); // Main bolt
        const lightning2 = new NoiseLine(8, { base: 40, amplitude: 0.2, speed: 0.015 }); // Secondary bolt

        // Create branches for the main lightning
        // These will randomly appear and follow segments of the main bolt
        for (let i = 0; i < 3; i++) {
            lightning.createChild({ base: 40, amplitude: 0.5, speed: 0.04 });
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

        const draw = () => {
            if (!ctx || !canvas) return;

            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            // Padding offset to align with the visual card border
            // Canvas is inset-[-8px], so the card starts at 8px
            const p = 8;
            const r = 32; // Card border radius

            ctx.clearRect(0, 0, w, h);

            // Define Control Points (The Visual Card Border Path)
            // We offset by 'p' to ensure lightning runs ON the border, not outside it
            const controls = [
                new Point(p + r, p),                // Top Left start
                new Point(w / 2, p),                  // Top Mid
                new Point(w - p - r, p),            // Top Right end
                new Point(w - p, p + r),            // Right Top
                new Point(w - p, h / 2),              // Right Mid
                new Point(w - p, h - p - r),        // Right Bottom
                new Point(w - p - r, h - p),        // Bottom Right
                new Point(w / 2, h - p),              // Bottom Mid
                new Point(p + r, h - p),            // Bottom Left
                new Point(p, h - p - r),            // Left Bottom
                new Point(p, h / 2),                  // Left Mid
                new Point(p, p + r)                 // Left Top
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
                    // Close the loop if it's the main bolt (children are open)
                    if (line === lightning || line === lightning2) {
                        ctx.lineTo(line.points[0].x, line.points[0].y);
                    }
                }
                ctx.stroke();
            };

            // Draw Layers (Glow + Core)
            // Outer Glow - Thinner (6 -> 4)
            drawBolt(lightning, 'rgba(221, 132, 72, 0.2)', 4, 12);

            // Inner Glow - Thinner (2 -> 1.5)
            drawBolt(lightning, 'rgba(221, 132, 72, 0.6)', 1.5, 6);

            // White Core - Thinner (1 -> 0.8)
            drawBolt(lightning, '#ffb380', 0.8, 0);

            // Secondary Bolt (Fainter, faster)
            drawBolt(lightning2, 'rgba(255, 255, 255, 0.2)', 0.5, 4);

            // Draw Branches
            lightning.children.forEach(child => {
                drawBolt(child, 'rgba(255, 255, 255, 0.3)', 0.5, 4);
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
