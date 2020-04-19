"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tf = __importStar(require("@tensorflow/tfjs"));
class bwImage {
    constructor(width, height, data) {
        if (data) {
            this._data = tf.tensor3d(data, [width, height, 1]);
        }
        else {
            this._data = null;
        }
    }
    static fromPath(width, height, path) {
        return path.rastorizeBW(width, height);
    }
    static fromImage(image) {
        let retImage = new bwImage(image.width, image.height);
        let imageData = tf.tensor(image.data, [image.width, image.height, 4]);
        imageData = imageData.div(imageData.max());
        retImage.setData(imageData);
        return retImage;
    }
    static fromCanvas(canvas) {
        let ctx = canvas.getContext('2d');
        let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let retImage = new bwImage();
        let imageData = tf.tensor(image.data, [image.width, image.height, 4]);
        imageData = imageData.div(imageData.max());
        retImage.setData(imageData);
        return retImage;
    }
    static fromTensor(tensor) {
        let retImage = new bwImage();
        retImage.setData(tensor);
        return retImage;
    }
    static concatImages(images) {
        let tensors = images.map(image => image.data);
        let tensorCollection = bwImage.fromTensor(tf.concat(tensors, 1));
        return bwImage.fromTensor(tf.concat(tensors, 1));
    }
    static imageListToCanvas(images) {
        let canvas = document.createElement("canvas");
        canvas.width = images.length * images[0].width;
        canvas.height = images[0].height;
        return new Promise((resolve, reject) => {
            bwImage.concatImages(images).putImageData(canvas).then(() => {
                resolve(canvas);
            });
        });
    }
    putImageData(canvas) {
        return tf.browser.toPixels(this._data, canvas);
    }
    setData(tensor) {
        if (tensor.shape[2] == 1) {
            this._data = tensor;
        }
        if (tensor.shape[2] == 4) {
            this._data = tensor.cumsum(2);
        }
    }
    get width() {
        if (this._data) {
            return this._data.shape[1];
        }
        else {
            return 0;
        }
    }
    get height() {
        if (this._data) {
            return this._data.shape[0];
        }
        else {
            return 0;
        }
    }
    get depth() {
        return 1;
    }
    get data() {
        if (this._data) {
            return this._data;
        }
        else {
            throw "Data No Assigned";
        }
    }
}
exports.bwImage = bwImage;
class RGBImage {
    constructor(width, height, data) {
        if (data) {
            this._data = tf.tensor3d(data, [width, height, 3]);
        }
        else {
            this._data = null;
        }
    }
    static fromPath(width, height, path) {
        return path.rastorizeRGB(width, height);
    }
    static fromImage(image) {
        let retImage = new bwImage(image.width, image.height);
        let imageData = tf.tensor(image.data, [image.width, image.height, 4]);
        imageData = imageData.div(imageData.max());
        retImage.setData(imageData);
        return retImage;
    }
    static fromCanvas(canvas) {
        throw "not implemented";
        let ctx = canvas.getContext('2d');
        let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let retImage = new bwImage();
        let imageData = tf.tensor(image.data, [image.width, image.height, 4]);
        imageData = imageData.div(imageData.max());
        retImage.setData(imageData);
        return retImage;
    }
    static fromTensor(tensor) {
        let retImage = new RGBImage();
        retImage.setData(tensor);
        return retImage;
    }
    static concatImages(images) {
        let tensors = images.map(image => image.data);
        let tensorCollection = bwImage.fromTensor(tf.concat(tensors, 1));
        return RGBImage.fromTensor(tf.concat(tensors, 1));
    }
    static imageListToCanvas(images) {
        let canvas = document.createElement("canvas");
        canvas.width = images.length * images[0].width;
        canvas.height = images[0].height;
        return new Promise((resolve, reject) => {
            RGBImage.concatImages(images).putImageData(canvas).then(() => {
                resolve(canvas);
            });
        });
    }
    putImageData(canvas) {
        return tf.browser.toPixels(this._data, canvas);
    }
    setData(tensor) {
        if (tensor.shape[2] == 3) {
            this._data = tensor;
        }
    }
    get width() {
        if (this._data) {
            return this._data.shape[1];
        }
        else {
            return 0;
        }
    }
    get height() {
        if (this._data) {
            return this._data.shape[0];
        }
        else {
            return 0;
        }
    }
    get depth() {
        return 3;
    }
    get data() {
        if (this._data) {
            return this._data;
        }
        else {
            throw "Data No Assigned";
        }
    }
}
exports.RGBImage = RGBImage;
