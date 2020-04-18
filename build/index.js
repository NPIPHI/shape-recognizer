"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tf = require("@tensorflow/tfjs");
const point_1 = require("./point");
var point_2 = require("./point");
exports.Point = point_2.Point;
const modelName = "accelerationTestingModel";
const labels = ["Zig", "ZigZag", "Rectangle", "Triangle", "Circle"];
async function shapePredictor() {
    let model = await tf.loadLayersModel("https://raw.githubusercontent.com/NPIPHI/shape-recognizer/master/models/accelerationTestingModel/model.json");
    return new ShapePredictor(model);
}
exports.shapePredictor = shapePredictor;
class ShapePredictor {
    constructor(model) {
        this.xRes = 64;
        this.yRes = 64;
        this.model = model;
    }
    predict(shape) {
        let image;
        let path;
        if (shape.map) {
            path = new point_1.PointPath(shape);
            path.normalize();
        }
        else if (shape.flip) {
            path.normalize;
        }
        if (path.points.length > 1) {
            image = path.rastorizeRGB(this.xRes, this.yRes);
            let prediction = this.model.predict(image.data.reshape([1, this.xRes, this.yRes, 3]));
            let values = prediction.dataSync();
            let index = values.indexOf(Math.max(...values));
            return labels[index];
        }
        else {
            throw "Incomplete shape";
        }
    }
}
//# sourceMappingURL=index.js.map