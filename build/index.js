"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tf = require("@tensorflow/tfjs");
const point_1 = require("./point");
var point_2 = require("./point");
exports.Point = point_2.Point;
const modelName = "accelerationTestingModel";
const labels = ["Zig", "ZigZag", "Rectangle", "Triangle", "Circle"];
function sP() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            tf.loadLayersModel("https://raw.githubusercontent.com/NPIPHI/shape-recognizer/master/models/accelerationTestingModel/model.json").then((nn) => {
                console.log("loaded model");
                resolve(new shapePredictor(nn));
            });
        });
    });
}
exports.sP = sP;
class shapePredictor {
    constructor(model) {
        this.xRes = 64;
        this.yRes = 64;
        this.model = model;
    }
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                tf.loadLayersModel("https://raw.githubusercontent.com/NPIPHI/shape-recognizer/master/models/accelerationTestingModel/model.json").then((nn) => {
                    console.log("loaded model");
                    resolve(new shapePredictor(nn));
                });
            });
        });
    }
    predict(shape) {
        let image;
        if (shape.map) {
            image = (new point_1.PointPath(shape)).rastorizeRGB(this.xRes, this.yRes);
        }
        else if (shape.flip) {
            image = shape.rastorizeRGB(this.xRes, this.yRes);
        }
        let prediction = this.model.predict(image.data.reshape([1, this.xRes, this.yRes, 3]));
        let values = prediction.dataSync();
        let index = values.indexOf(Math.max(...values));
        return labels[index];
    }
}
//# sourceMappingURL=index.js.map