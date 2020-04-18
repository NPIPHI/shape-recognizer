import { bwImage, RGBImage } from "./image";
export declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    dist(point: Point): number;
    length(): number;
    inverse(): Point;
    timesEquals(delta: Point): void;
    times(scalar: number): Point;
    plusEquals(delta: Point): void;
    plus(delta: Point): Point;
    minusEquals(delta: Point): void;
    minus(delta: Point): Point;
    rotate(theta: number): void;
    dot(vec: Point): number;
    normalize(): Point;
    angle(): number;
}
declare class Transform {
    offset: Point;
    scale: Point;
    theta: number;
    order: boolean;
    constructor(offset: Point, theta: number, scale: Point, order?: boolean);
    inverse(): Transform;
}
export declare class PointPath {
    points: Point[];
    lastTranform: Transform;
    private length;
    private distances;
    constructor(points: Point[]);
    push(point: Point): void;
    posAt(scalar: number): Point;
    speedAt(scalar: number): number;
    accelerationAt(scalar: number): number;
    normalize(): void;
    applyTransform(transform: Transform): void;
    rotate(theta: number): void;
    getLength(): number;
    private getNormalizeTranform;
    private getBoundingBox;
    private hull;
    private quickHall;
    rastorizeBW(xRes: number, yRes: number, blurRadius?: number): bwImage;
    rastorizeRGB(xRes: number, yRes: number, blurRadius?: number): RGBImage;
    flip(): PointPath;
}
export {};
