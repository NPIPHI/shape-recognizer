"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tf = require("@tensorflow/tfjs");
const point_1 = require("./point");
var point_2 = require("./point");
exports.Point = point_2.Point;
const modelName = "accelerationTestingModel";
const labels = ["Zig", "ZigZag", "Rectangle", "Triangle", "Circle"];
class ShapePredictor {
    constructor(model) {
        this.xRes = 64;
        this.yRes = 64;
        this.model = model;
    }
    static async loadModel() {
        let model = await tf.loadLayersModel("https://raw.githubusercontent.com/NPIPHI/shape-recognizer/master/models/accelerationTestingModel/model.json");
        return new ShapePredictor(model);
    }
    predict(shape) {
        let image;
        let path;
        if (shape.map) {
            let pointShape = shape.map((point) => new point_1.Point(point.x, point.y));
            path = new point_1.PointPath(pointShape);
        }
        else if (shape.flip) {
        }
        if (path.points.length > 1) {
            path.normalize();
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
exports.ShapePredictor = ShapePredictor;
//# sourceMappingURL=index.js.map