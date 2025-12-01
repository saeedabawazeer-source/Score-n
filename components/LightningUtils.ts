
// Strict 1:1 Port of User's Lightning JavaScript
// Implements Point, PerlinNoise, NoiseLine, NoiseLineChild, and helper functions

export class Point {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    add(p: Point): Point {
        return new Point(this.x + p.x, this.y + p.y);
    }

    subtract(p: Point): Point {
        return new Point(this.x - p.x, this.y - p.y);
    }

    multiply(scalar: number): Point {
        return new Point(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number): Point {
        return new Point(this.x / scalar, this.y / scalar);
    }

    distance(p: Point): number {
        const dx = this.x - p.x;
        const dy = this.y - p.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    set(x: number, y: number): Point {
        this.x = x;
        this.y = y;
        return this;
    }

    clone(): Point {
        return new Point(this.x, this.y);
    }
}

// Simple Xorshift for randomness
class Xorshift {
    x: number = 123456789;
    y: number = 362436069;
    z: number = 521288629;
    w: number = 88675123;

    constructor(seed: number) {
        if (seed) {
            this.x ^= seed;
            this.y ^= seed;
            this.z ^= seed;
            this.w ^= seed;
        }
    }

    random(): number {
        const t = this.x ^ (this.x << 11);
        this.x = this.y; this.y = this.z; this.z = this.w;
        this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
        return (this.w >>> 0) / 4294967296;
    }
}

// Perlin Noise Implementation
export class PerlinNoise {
    private perm: number[] = [];
    private grad3 = [
        [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
        [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
        [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];

    constructor(seed: number = Date.now()) {
        const rng = new Xorshift(seed);
        const p = new Array(256).fill(0).map(() => Math.floor(rng.random() * 256));
        this.perm = new Array(512).fill(0).map((_, i) => p[i & 255]);
    }

    private dot(g: number[], x: number, y: number): number {
        return g[0] * x + g[1] * y;
    }

    private mix(a: number, b: number, t: number): number {
        return (1 - t) * a + t * b;
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    noise2d(x: number, y: number): number {
        let X = Math.floor(x);
        let Y = Math.floor(y);
        x = x - X;
        y = y - Y;
        X = X & 255;
        Y = Y & 255;

        const gi00 = this.perm[X + this.perm[Y]] % 12;
        const gi01 = this.perm[X + this.perm[Y + 1]] % 12;
        const gi10 = this.perm[X + 1 + this.perm[Y]] % 12;
        const gi11 = this.perm[X + 1 + this.perm[Y + 1]] % 12;

        const n00 = this.dot(this.grad3[gi00], x, y);
        const n10 = this.dot(this.grad3[gi10], x - 1, y);
        const n01 = this.dot(this.grad3[gi01], x, y - 1);
        const n11 = this.dot(this.grad3[gi11], x - 1, y - 1);

        const u = this.fade(x);
        const v = this.fade(y);

        const nx0 = this.mix(n00, n10, u);
        const nx1 = this.mix(n01, n11, u);
        return this.mix(nx0, nx1, v);
    }
}

// Catmull-Rom Spline Interpolation
function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const v0 = (p2 - p0) / 2;
    const v1 = (p3 - p1) / 2;
    return (2 * p1 - 2 * p2 + v0 + v1) * t * t * t
        + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t * t + v0 * t + p1;
}

function spline(controls: Point[], segmentsNum: number, closed: boolean = false): Point[] {
    const ctrls = controls.map(p => p.clone());

    if (closed) {
        ctrls.unshift(ctrls[ctrls.length - 1]);
        ctrls.push(ctrls[1]);
        ctrls.push(ctrls[2]);
    } else {
        ctrls.unshift(ctrls[0]);
        ctrls.push(ctrls[ctrls.length - 1]);
    }

    const points: Point[] = [];
    const len = closed ? ctrls.length - 3 : ctrls.length - 3;

    for (let i = 0; i < len; i++) {
        const p0 = ctrls[i];
        const p1 = ctrls[i + 1];
        const p2 = ctrls[i + 2];
        const p3 = ctrls[i + 3];

        for (let j = 0; j < segmentsNum; j++) {
            const t = (j + 1) / segmentsNum;
            points.push(new Point(
                catmullRom(p0.x, p1.x, p2.x, p3.x, t),
                catmullRom(p0.y, p1.y, p2.y, p3.y, t)
            ));
        }
    }

    if (!closed) {
        points.unshift(ctrls[1]);
    }

    return points;
}

function shortest(bases: Point[]): Point[] {
    if (bases.length === 0) return [];
    const points = [bases[0]];
    let i = 0;
    const len = bases.length;

    while (i < len) {
        const p = bases[i];
        let minDist = Infinity;
        let k = -1;

        for (let j = i + 1; j < len; j++) {
            const p2 = bases[j];
            const dist = p.distance(p2);
            if (dist < minDist) {
                minDist = dist;
                k = j;
            }
        }

        if (k < 0) break;

        points.push(bases[k]);
        i = k;
    }

    return points;
}

export class NoiseLine {
    points: Point[] = [];
    noiseOptions: { base: number, amplitude: number, speed: number, offset: number };
    segmentsNum: number;
    perlin: PerlinNoise;
    children: NoiseLineChild[] = [];

    constructor(segmentsNum: number, noiseOptions: any) {
        this.segmentsNum = segmentsNum;
        this.noiseOptions = {
            base: 30,
            amplitude: 0.5,
            speed: 0.002,
            offset: 0,
            ...noiseOptions
        };
        this.perlin = new PerlinNoise();
    }

    createChild(noiseOptions?: any): NoiseLineChild {
        const child = new NoiseLineChild(this, noiseOptions || this.noiseOptions);
        this.children.push(child);
        return child;
    }

    update(controls: Point[], closed: boolean = false) {
        // Calculate line length for noise range
        let lineLength = 0;
        for (let i = 0; i < controls.length - 1; i++) {
            lineLength += controls[i].distance(controls[i + 1]);
        }
        if (closed) {
            lineLength += controls[controls.length - 1].distance(controls[0]);
        }

        // Generate spline points
        const basePoints = spline(controls, this.segmentsNum, closed);

        // Apply noise
        this.applyNoise(basePoints, lineLength);

        // Shortest path optimization is DESTRUCTIVE for closed loops (borders).
        // It reorders points based on proximity, which scrambles the border path.
        // We strictly follow the spline order.
        // this.points = shortest(this.points); 

        // Update children
        this.children.forEach(child => child.update());
    }

    protected applyNoise(bases: Point[], range: number) {
        this.points = [];
        const opts = this.noiseOptions;
        const base = opts.base;
        const amp = opts.amplitude;
        const speed = opts.speed;

        opts.offset += speed;

        const len = bases.length;

        for (let i = 0; i < len; i++) {
            const p = bases[i];
            const next = bases[(i + 1) % len];

            const angle = Math.atan2(next.y - p.y, next.x - p.x);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // Exact noise logic from snippet
            const av = range * this.perlin.noise2d(i / base - opts.offset, opts.offset) * 0.5 * amp;
            const ax = av * sin;
            const ay = av * cos;

            const bv = range * this.perlin.noise2d(i / base + opts.offset, opts.offset) * 0.5 * amp;
            const bx = bv * sin;
            const by = bv * cos;

            const m = Math.sin(Math.PI * (i / (len - 1)));

            const px = p.x + (ax - bx) * m;
            const py = p.y - (ay - by) * m;

            this.points.push(new Point(px, py));
        }
    }
}

export class NoiseLineChild extends NoiseLine {
    parent: NoiseLine;
    startStep: number = 0;
    endStep: number = 0;
    lastChangeTime: number = 0;

    constructor(parent: NoiseLine, noiseOptions: any) {
        super(0, noiseOptions);
        this.parent = parent;
    }

    update() {
        const parentPoints = this.parent.points;
        const plen = parentPoints.length;
        if (plen === 0) return;

        const currentTime = Date.now();

        if (currentTime - this.lastChangeTime > 10000 * Math.random() || plen < this.endStep) {
            const stepMin = Math.floor(plen / 10);
            this.startStep = Math.floor(Math.random() * Math.floor(plen / 3 * 2));
            this.endStep = this.startStep + stepMin + Math.floor(Math.random() * (plen - this.startStep - stepMin) + 1);
            this.lastChangeTime = currentTime;
        }

        const range = parentPoints.slice(this.startStep, this.endStep);
        if (range.length < 2) return;

        const sep = 2;
        const seg = (range.length - 1) / sep;
        const controls: Point[] = [];
        for (let i = 0; i <= sep; i++) {
            const idx = Math.floor(seg * i);
            if (range[idx]) controls.push(range[idx]);
        }

        const basePoints = spline(controls, Math.floor(range.length / 3));

        // Use distance between first and last control point as range
        const dist = controls[0].distance(controls[controls.length - 1]);

        this.applyNoise(basePoints, dist);
        // this.points = shortest(this.points); // Removed for stability
    }
}
