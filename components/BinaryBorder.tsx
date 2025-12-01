import React, { useEffect, useRef } from 'react';

interface BinaryBorderProps {
    children: React.ReactNode;
    className?: string;
}

export const BinaryBorder: React.FC<BinaryBorderProps> = ({ children, className = '' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        // Binary Stream Logic
        const characters = "01";
        const fontSize = 14;
        const speed = 1; // Pixels per frame

        // We'll treat the border as a single continuous path
        // Top -> Right -> Bottom -> Left

        let offset = 0;

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
            const p = 4; // Padding/Inset

            ctx.clearRect(0, 0, w, h);

            // Draw Black Background Border
            ctx.beginPath();
            ctx.roundRect(p, p, w - p * 2, h - p * 2, r);
            ctx.lineWidth = 24; // Thick black border
            ctx.strokeStyle = '#000000';
            ctx.stroke();

            // Calculate total path length
            // Top (w - 2r) + Right (h - 2r) + Bottom (w - 2r) + Left (h - 2r) + 4 corners (2 * PI * r)
            // Simplified: 2w + 2h - 8r + 2 * PI * r
            const perimeter = 2 * (w - p * 2) + 2 * (h - p * 2) - 8 * r + 2 * Math.PI * r;

            // Draw Binary Stream
            ctx.font = `${fontSize}px monospace`;
            ctx.fillStyle = '#00FF00'; // Matrix Green
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            const charCount = Math.floor(perimeter / fontSize);

            offset = (offset + speed) % (fontSize * 2); // Loop offset

            for (let i = 0; i < charCount; i++) {
                // Calculate position along the path
                const dist = (i * fontSize + offset) % perimeter;

                // Map distance to x, y coordinates along rounded rect
                let x = 0, y = 0, angle = 0;

                const topLen = w - p * 2 - 2 * r;
                const rightLen = h - p * 2 - 2 * r;
                const cornerLen = 0.5 * Math.PI * r;

                // Segments: Top, TR Corner, Right, BR Corner, Bottom, BL Corner, Left, TL Corner

                if (dist < topLen) {
                    // Top Edge
                    x = p + r + dist;
                    y = p;
                    angle = 0;
                } else if (dist < topLen + cornerLen) {
                    // TR Corner
                    const d = dist - topLen;
                    const a = (d / cornerLen) * (Math.PI / 2); // 0 to 90 deg
                    x = w - p - r + Math.sin(a) * r;
                    y = p + r - Math.cos(a) * r;
                    angle = a;
                } else if (dist < topLen + cornerLen + rightLen) {
                    // Right Edge
                    const d = dist - (topLen + cornerLen);
                    x = w - p;
                    y = p + r + d;
                    angle = Math.PI / 2;
                } else if (dist < topLen + cornerLen + rightLen + cornerLen) {
                    // BR Corner
                    const d = dist - (topLen + cornerLen + rightLen);
                    const a = (d / cornerLen) * (Math.PI / 2);
                    x = w - p - r + Math.cos(a) * r;
                    y = h - p - r + Math.sin(a) * r;
                    angle = Math.PI / 2 + a;
                } else if (dist < topLen + cornerLen + rightLen + cornerLen + topLen) {
                    // Bottom Edge
                    const d = dist - (topLen + cornerLen + rightLen + cornerLen);
                    x = w - p - r - d;
                    y = h - p;
                    angle = Math.PI;
                } else if (dist < topLen + cornerLen + rightLen + cornerLen + topLen + cornerLen) {
                    // BL Corner
                    const d = dist - (topLen + cornerLen + rightLen + cornerLen + topLen);
                    const a = (d / cornerLen) * (Math.PI / 2);
                    x = p + r - Math.sin(a) * r;
                    y = h - p - r + Math.cos(a) * r;
                    angle = Math.PI + a;
                } else if (dist < topLen + cornerLen + rightLen + cornerLen + topLen + cornerLen + rightLen) {
                    // Left Edge
                    const d = dist - (topLen + cornerLen + rightLen + cornerLen + topLen + cornerLen);
                    x = p;
                    y = h - p - r - d;
                    angle = -Math.PI / 2;
                } else {
                    // TL Corner
                    const d = dist - (topLen + cornerLen + rightLen + cornerLen + topLen + cornerLen + rightLen);
                    const a = (d / cornerLen) * (Math.PI / 2);
                    x = p + r - Math.cos(a) * r;
                    y = p + r - Math.sin(a) * r;
                    angle = -Math.PI / 2 + a;
                }

                // Randomly flip bits occasionally
                const char = Math.random() > 0.95 ? (Math.random() > 0.5 ? "1" : "0") : (i % 2 === 0 ? "1" : "0");

                // Draw character
                ctx.save();
                ctx.translate(x, y);
                // ctx.rotate(angle); // Optional: Rotate text to follow path
                ctx.fillText(char, 0, 0);
                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return (
        <div className={`relative w-full h-full ${className}`}>
            <div ref={containerRef} className="relative w-full h-full">
                {/* Canvas Wrapper */}
                <div className="absolute inset-[-4px] pointer-events-none z-30">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full"
                        style={{ background: 'transparent' }}
                    />
                </div>
                <div className="absolute inset-0 z-20">
                    {children}
                </div>
            </div>
        </div>
    );
};
