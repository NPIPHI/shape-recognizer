import { PointPath } from "./point";
export declare class drawingCanvas {
    ctx: CanvasRenderingContext2D;
    path: PointPath;
    constructor(width: number, height: number, outputResouluton: number);
    private mouseMove;
    private startDrawing;
    private endDrawing;
    onFinishDrawing(ojb: any): void;
}
export declare function mouse(): {
    left: boolean;
    right: boolean;
    x: number;
    y: number;
};
