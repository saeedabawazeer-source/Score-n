import React, { useEffect, useRef } from 'react';

const DPR = window.devicePixelRatio || 1;
const CELL_WIDTH = 8 * DPR;
const CELL_HEIGHT = 8 * DPR;
const FLAME_COLOR_DEPTH = 24;
const FLAME_COLOR_TABLE: [number, string][] = [
    [0, 'lavender'],
    [0.1, 'yellow'],
    [0.3, 'gold'],
    [0.5, 'hotpink'],
    [0.6, 'tomato'],
    [0.8, 'darkslateblue'],
    [1, 'rgba(0,0,0,0)'],
];

const SPREAD_FROM = [
    'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom', 'bottom',
    'left', 'left', 'right', 'right', 'top',
];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGradientArray(size: number, colorStops: [number, string][]) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];
    canvas.width = size;
    canvas.height = 1;

    const gradient = ctx.createLinearGradient(0, 0, size, 0);
    colorStops.forEach(args => gradient.addColorStop(...args));

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, 1);

    return Array(size)
        .fill(null)
        .map((_, x) => {
            const data = ctx.getImageData(x, 0, 1, 1).data;
            return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        });
}

class Pixel {
    x: number;
    y: number;
    idx: number;
    arr: string[];
    top?: Pixel;
    left?: Pixel;
    bottom?: Pixel;
    right?: Pixel;

    constructor(x: number, y: number, arr: string[]) {
        this.x = x;
        this.y = y;
        this.idx = arr.length - 1;
        this.arr = arr;
    }

    setSides({ top, left, bottom, right }: { top?: Pixel, left?: Pixel, bottom?: Pixel, right?: Pixel }) {
        this.top = top;
        this.left = left;
        this.bottom = bottom;
        this.right = right;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const fill = this.arr[this.idx];
        ctx.fillStyle = fill;
        ctx.fillRect(this.x, this.y, CELL_WIDTH, CELL_HEIGHT);
    }

    update() {
        const sideKey = SPREAD_FROM[getRandomInt(0, SPREAD_FROM.length - 1)] as 'top' | 'left' | 'bottom' | 'right';
        const dest = this[sideKey];

        if (dest && dest.idx < this.idx) {
            const rand = getRandomInt(-1, 4);
            this.idx = dest.idx + rand;
        } else {
            this.idx += 1;
        }

        if (this.idx > this.arr.length - 1) {
            this.idx = this.arr.length - 1;
        } else if (this.idx < 0) {
            this.idx = 0;
        }
    }
}

class Matrix {
    rows: number = 0;
    columns: number = 0;
    pixels: Pixel[][] = [];

    createMatrix(bounds: { w: number, h: number }) {
        const colors = createGradientArray(FLAME_COLOR_DEPTH, FLAME_COLOR_TABLE);
        this.rows = Math.ceil(bounds.h / CELL_HEIGHT);
        this.columns = Math.ceil(bounds.w / CELL_WIDTH);
        this.pixels = [];

        for (let row = 0; row < this.rows; row++) {
            this.pixels[row] = [];
            for (let col = 0; col < this.columns; col++) {
                const x = col * CELL_WIDTH;
                const y = row * CELL_HEIGHT;
                this.pixels[row][col] = new Pixel(x, y, colors);
            }
        }

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const pixel = this.pixels[row][col];
                const top = row > 0 ? this.pixels[row - 1][col] : undefined;
                const left = col > 0 ? this.pixels[row][col - 1] : undefined;
                const bottom = row < this.rows - 1 ? this.pixels[row + 1][col] : undefined;
                const right = col < this.columns - 1 ? this.pixels[row][col + 1] : undefined;
                pixel.setSides({ top, left, bottom, right });
            }
        }
    }

    update(ctx: CanvasRenderingContext2D, bounds: { w: number, h: number }, tick: number, pointer: { x: number, y: number } | null, topOverflow: number) {
        let pointCol, pointRow;

        if (pointer) {
            pointCol = Math.floor(pointer.x / CELL_WIDTH);
            pointRow = Math.floor(pointer.y / CELL_HEIGHT);
        }

        const startRow = Math.floor(topOverflow / CELL_HEIGHT);

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const pixel = this.pixels[row][col];

                // Interactive pointer fire
                if (pointRow === row && pointCol === col) {
                    pixel.idx = 0;
                }

                // Ring Ignition
                // Ignite bottom
                if (row === this.rows - 1) {
                    pixel.idx = 0;
                }
                // Ignite sides (below top overflow)
                if ((col === 0 || col === this.columns - 1) && row >= startRow) {
                    pixel.idx = 0;
                }
                // Ignite top of card (at startRow)
                if (row === startRow) {
                    pixel.idx = 0;
                }

                pixel.draw(ctx);
                pixel.update();
            }
        }
    }
}

interface BitfireCanvasProps {
    topOverflow?: number;
}

export const BitfireCanvas: React.FC<BitfireCanvasProps> = ({ topOverflow = 0 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const tickRef = useRef(0);
    const matrixRef = useRef(new Matrix());
    const pointerRef = useRef<{ x: number, y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const { width, height } = container.getBoundingClientRect();
            canvas.width = width * DPR;
            canvas.height = height * DPR;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            // Recreate matrix on resize
            matrixRef.current.createMatrix({ w: canvas.width, h: canvas.height });
        };

        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            if (!ctx || !canvas) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const bounds = {
                w: canvas.width,
                h: canvas.height,
            };

            // Convert topOverflow from px to canvas units (DPR scaled)
            const scaledTopOverflow = topOverflow * DPR;

            matrixRef.current.update(ctx, bounds, tickRef.current, pointerRef.current, scaledTopOverflow);
            tickRef.current++;
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = {
                x: (e.clientX - rect.left) * DPR,
                y: (e.clientY - rect.top) * DPR
            };
        };

        const handleMouseLeave = () => {
            pointerRef.current = null;
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('resize', resize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-auto">
            <canvas
                ref={canvasRef}
                className="w-full h-full block touch-none cursor-none"
            />
        </div>
    );
};
