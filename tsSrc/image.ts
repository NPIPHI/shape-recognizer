import * as tf from "@tensorflow/tfjs"
import { PointPath } from "./point"

export class bwImage {
    private _data: tf.Tensor3D;
    constructor(width?: number, height?: number, data?: Float32Array) {
        if (data) {
            this._data = tf.tensor3d(data, [width, height, 1]);
        } else {
            this._data = null;
        }
    }
    static fromPath(width: number, height: number, path: PointPath): bwImage {
        return path.rastorizeBW(width, height);
    }
    static fromImage(image: ImageData): bwImage {
        let retImage = new bwImage(image.width, image.height);
        let imageData: tf.Tensor3D = tf.tensor(image.data, [image.width, image.height, 4]);
        imageData = imageData.div(imageData.max());
        retImage.setData(imageData);
        return retImage;
    }
    static fromCanvas(canvas: HTMLCanvasElement): bwImage {
        let ctx = canvas.getContext('2d')
        let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let retImage = new bwImage();
        let imageData: tf.Tensor3D = tf.tensor(image.data, [image.width, image.height, 4]);
        imageData = imageData.div(imageData.max());
        retImage.setData(imageData);
        return retImage;
    }
    static fromTensor(tensor: tf.Tensor3D): bwImage {
        let retImage = new bwImage();
        retImage.setData(tensor);
        return retImage;
    }
    static concatImages(images: bwImage[]): bwImage {
        let tensors = images.map(image=>image.data)
        let tensorCollection = bwImage.fromTensor(tf.concat(tensors, 1))
        return bwImage.fromTensor(tf.concat(tensors, 1))
    }
    static imageListToCanvas(images: bwImage[]): Promise<HTMLCanvasElement> {
        let canvas = document.createElement("canvas");
        canvas.width = images.length * images[0].width;
        canvas.height = images[0].height;
        return new Promise((resolve, reject)=>{
            bwImage.concatImages(images).putImageData(canvas).then(()=>{
                resolve(canvas);
            })
        })
    }
    putImageData(canvas: HTMLCanvasElement): Promise<Uint8ClampedArray> {
        return tf.browser.toPixels(this._data, canvas)
    }
    setData(tensor: tf.Tensor3D): void {
        if (tensor.shape[2] == 1) {
            this._data = tensor;
        }
        if (tensor.shape[2] == 4) {
            this._data = tensor.cumsum(2)
        }
    }
    get width(): number {
        if (this._data) {
            return this._data.shape[1];
        }
        else {
            return 0;
        }
    }
    get height(): number {
        if (this._data) {
            return this._data.shape[0];
        }
        else {
            return 0;
        }
    }
    get depth(): number {
        return 1;
    }
    get data(): tf.Tensor3D {
        if (this._data) {
            return this._data;
        }
        else {
            throw "Data No Assigned"
        }
    }
}

export class RGBImage {
    private _data: tf.Tensor3D;
    constructor(width?: number, height?: number, data?: Float32Array) {
        if (data) {
            this._data = tf.tensor3d(data, [width, height, 3]);
        } else {
            this._data = null;
        }
    }
    static fromPath(width: number, height: number, path: PointPath): RGBImage {
        return path.rastorizeRGB(width, height);
    }
    static fromImage(image: ImageData): bwImage {
        let retImage = new bwImage(image.width, image.height);
        let imageData: tf.Tensor3D = tf.tensor(image.data, [image.width, image.height, 4]);
        imageData = imageData.div(imageData.max());
        retImage.setData(imageData);
        return retImage;
    }
    static fromCanvas(canvas: HTMLCanvasElement): bwImage {
        throw "not implemented"
        let ctx = canvas.getContext('2d')
        let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let retImage = new bwImage();
        let imageData: tf.Tensor3D = tf.tensor(image.data, [image.width, image.height, 4]);
        imageData = imageData.div(imageData.max());
        retImage.setData(imageData);
        return retImage;
    }
    static fromTensor(tensor: tf.Tensor3D): RGBImage {
        let retImage = new RGBImage();
        retImage.setData(tensor);
        return retImage;
    }
    static concatImages(images: RGBImage[]): RGBImage {
        let tensors = images.map(image=>image.data)
        let tensorCollection = bwImage.fromTensor(tf.concat(tensors, 1))
        return RGBImage.fromTensor(tf.concat(tensors, 1))
    }
    static imageListToCanvas(images: RGBImage[]): Promise<HTMLCanvasElement> {
        let canvas = document.createElement("canvas");
        canvas.width = images.length * images[0].width;
        canvas.height = images[0].height;
        return new Promise((resolve, reject)=>{
            RGBImage.concatImages(images).putImageData(canvas).then(()=>{
                resolve(canvas);
            })
        })
    }
    putImageData(canvas: HTMLCanvasElement): Promise<Uint8ClampedArray> {
        return tf.browser.toPixels(this._data, canvas)
    }
    setData(tensor: tf.Tensor3D): void {
        if (tensor.shape[2] == 3) {
            this._data = tensor;
        }
    }
    get width(): number {
        if (this._data) {
            return this._data.shape[1];
        }
        else {
            return 0;
        }
    }
    get height(): number {
        if (this._data) {
            return this._data.shape[0];
        }
        else {
            return 0;
        }
    }
    get depth(): number {
        return 3;
    }
    get data(): tf.Tensor3D {
        if (this._data) {
            return this._data;
        }
        else {
            throw "Data No Assigned"
        }
    }
}