"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tf = require("@tensorflow/tfjs");
const point_1 = require("./point");
const meta_1 = require("./meta");
const modelName = "accelerationTestingModel";
class Prediction {
    constructor(label, boundingBox, center, confidence, shape) {
        this.label = label;
        this.boundingBox = boundingBox;
        this.center = center;
        this.confidence = confidence;
        this.shape = shape;
    }
}
exports.Prediction = Prediction;
class ShapePredictor {
    constructor(model) {
        this.xRes = 64;
        this.yRes = 64;
        this.model = model;
    }
    static async loadModel() {
        let model = await tf.loadLayersModel("https://raw.githubusercontent.com/NPIPHI/shape-recognizer/master/models/recognizer/model.json");
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
            path = shape;
        }
        if (path.points.length > 1) {
            return this.anyaliseShape(path);
        }
        else {
            throw "Incomplete shape";
        }
    }
    anyaliseShape(path) {
        let boundingBox = path.getAxisAlignedBoundingBox();
        path.normalize();
        let image = path.rastorizeRGB(this.xRes, this.yRes);
        let label = this.model.predict(image.data.reshape([1, this.xRes, this.yRes, 3]));
        let values = label.dataSync();
        let index = values.indexOf(Math.max(...values));
        values.sort((a, b) => (b - a));
        let maxConfidence = values[0];
        let minConfidence = Math.max(0, values[1]);
        let confidence = (maxConfidence - minConfidence) / maxConfidence;
        return new Prediction(meta_1.labels[index], { x1: boundingBox.points[0].x, y1: boundingBox.points[0].y, x2: boundingBox.points[2].x, y2: boundingBox.points[2].y }, boundingBox.points[0].plus(boundingBox.points[2]).times(0.5), confidence, boundingBox.points);
    }
    getKeyPoints(path, label) {
        let boundingBox = path.getAxisAlignedBoundingBox().points;
    }
}
exports.ShapePredictor = ShapePredictor;
//# sourceMappingURL=index.js.map