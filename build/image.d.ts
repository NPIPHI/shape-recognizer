import * as tf from "@tensorflow/tfjs";
import { PointPath } from "./point";
export declare class bwImage {
    private _data;
    constructor(width?: number, height?: number, data?: Float32Array);
    static fromPath(width: number, height: number, path: PointPath): bwImage;
    static fromImage(image: ImageData): bwImage;
    static fromCanvas(canvas: HTMLCanvasElement): bwImage;
    static fromTensor(tensor: tf.Tensor3D): bwImage;
    static concatImages(images: bwImage[]): bwImage;
    static imageListToCanvas(images: bwImage[]): Promise<HTMLCanvasElement>;
    putImageData(canvas: HTMLCanvasElement): Promise<Uint8ClampedArray>;
    setData(tensor: tf.Tensor3D): void;
    get width(): number;
    get height(): number;
    get depth(): number;
    get data(): tf.Tensor3D;
}
export declare class RGBImage {
    private _data;
    constructor(width?: number, height?: number, data?: Float32Array);
    static fromPath(width: number, height: number, path: PointPath): RGBImage;
    static fromImage(image: ImageData): bwImage;
    static fromCanvas(canvas: HTMLCanvasElement): bwImage;
    static fromTensor(tensor: tf.Tensor3D): RGBImage;
    static concatImages(images: RGBImage[]): RGBImage;
    static imageListToCanvas(images: RGBImage[]): Promise<HTMLCanvasElement>;
    putImageData(canvas: HTMLCanvasElement): Promise<Uint8ClampedArray>;
    setData(tensor: tf.Tensor3D): void;
    get width(): number;
    get height(): number;
    get depth(): number;
    get data(): tf.Tensor3D;
}
