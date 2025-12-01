import React, { useEffect, useRef } from 'react';
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
        let time = 0;

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
            const r = 32; // Border radius
            const p = -1; // Offset outward by 1px so lightning never touches inside card

            ctx.clearRect(0, 0, w, h);

            // Draw Base Path (The "Wire")
            // We want the lightning to be EXACTLY on this path, with minimal deviation

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Path segments
            const topLen = w - p * 2 - 2 * r;
            const rightLen = h - p * 2 - 2 * r;
            const cornerLen = 0.5 * Math.PI * r;
            const perimeter = 2 * topLen + 2 * rightLen + 4 * cornerLen;

            // Generate jagged points along the perimeter
            const points: { x: number, y: number }[] = [];
            const segmentLength = 3; // Pixel distance between points
            const numPoints = Math.floor(perimeter / segmentLength);

            time += 0.15; // Animation speed (slowed down)

            ctx.beginPath();

            for (let i = 0; i <= numPoints; i++) {
                const dist = (i * segmentLength);

                // Map distance to x, y, angle
                let x = 0, y = 0, angle = 0;

                if (dist < topLen) { // Top
                    x = p + r + dist; y = p; angle = 0;
                } else if (dist < topLen + cornerLen) { // TR
                    const d = dist - topLen;
                    const a = (d / cornerLen) * (Math.PI / 2);
                    x = w - p - r + Math.sin(a) * r;
                    y = p + r - Math.cos(a) * r;
                    angle = a;
                } else if (dist < topLen + cornerLen + rightLen) { // Right
                    const d = dist - (topLen + cornerLen);
                    x = w - p; y = p + r + d; angle = Math.PI / 2;
                } else if (dist < topLen + cornerLen + rightLen + cornerLen) { // BR
                    const d = dist - (topLen + cornerLen + rightLen);
                    const a = (d / cornerLen) * (Math.PI / 2);
                    x = w - p - r + Math.cos(a) * r;
                    y = h - p - r + Math.sin(a) * r;
                    angle = Math.PI / 2 + a;
                } else if (dist < topLen + cornerLen + rightLen + cornerLen + topLen) { // Bottom
                    const d = dist - (topLen + cornerLen + rightLen + cornerLen);
                    x = w - p - r - d; y = h - p; angle = Math.PI;
                } else if (dist < topLen + cornerLen + rightLen + cornerLen + topLen + cornerLen) { // BL
                    const d = dist - (topLen + cornerLen + rightLen + cornerLen + topLen);
                    const a = (d / cornerLen) * (Math.PI / 2);
                    x = p + r - Math.sin(a) * r;
                    y = h - p - r + Math.cos(a) * r;
                    angle = Math.PI + a;
                } else if (dist < topLen + cornerLen + rightLen + cornerLen + topLen + cornerLen + rightLen) { // Left
                    const d = dist - (topLen + cornerLen + rightLen + cornerLen + topLen + cornerLen);
                    x = p; y = h - p - r - d; angle = -Math.PI / 2;
                } else { // TL
                    const d = dist - (topLen + cornerLen + rightLen + cornerLen + topLen + cornerLen + rightLen);
                    const a = (d / cornerLen) * (Math.PI / 2);
                    x = p + r - Math.cos(a) * r;
                    y = p + r - Math.sin(a) * r;
                    angle = -Math.PI / 2 + a;
                }

                // Jitter Logic - STRICTLY CONSTRAINED
                // Perpendicular displacement
                // Use sine waves + random for "electric" look but kept tight
                const jitter = (Math.sin(i * 0.5 + time) * Math.cos(i * 0.2 - time * 2)) * 1.5; // Max 1.5px deviation

                // Perpendicular vector (-sin, cos) relative to angle? No, angle is tangent.
                // Tangent is (cos(a), sin(a)). Normal is (-sin(a), cos(a)).

                const nx = -Math.sin(angle);
                const ny = Math.cos(angle);

                const px = x + nx * jitter;
                const py = y + ny * jitter;

                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }

            ctx.closePath();

            // Render - Single tight pass
            // Core
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            ctx.stroke();

            // Glow - Very tight
            ctx.strokeStyle = 'rgba(0, 191, 255, 0.8)'; // Deep Sky Blue
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(0, 191, 255, 0.8)';
            ctx.shadowBlur = 4;
            ctx.stroke();

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
                {/* Canvas Wrapper - Tight fit */}
                <div className="absolute inset-[-4px] pointer-events-none z-30">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full"
                        style={{ background: 'transparent' }}
                    />
                </div>
                <div className="absolute inset-0 z-20 overflow-visible">
                    {children}
                </div>
            </div>
        </div>
    );
};
