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
const point_1 = require("./point");
const meta_1 = require("./meta");
const loadModel_1 = require("./loadModel");
var meta_2 = require("./meta");
exports.labels = meta_2.labels;
class Prediction {
    constructor(label, boundingBox, confidence) {
        this.label = label;
        this.boundingBox = boundingBox;
        this.confidence = confidence;
    }
}
exports.Prediction = Prediction;
class Ellipse extends Prediction {
    constructor(boundingBox, confidence) {
        super("Ellipse", boundingBox, confidence);
        this.xRadius = (boundingBox.x2 - boundingBox.x1) / 2;
        this.yRadius = (boundingBox.y2 - boundingBox.y1) / 2;
        this.center = { x: (boundingBox.x1 + boundingBox.x2) / 2, y: (boundingBox.y1 + boundingBox.y2) / 2 };
    }
}
exports.Ellipse = Ellipse;
class Rectangle extends Prediction {
    constructor(boundingBox, confidence) {
        super("Rectangle", boundingBox, confidence);
    }
}
exports.Rectangle = Rectangle;
class RightTriangle extends Prediction {
    constructor(boundingBox, confidence, vertex) {
        super("RightTriangle", boundingBox, confidence);
        this.rightVertex = { x: vertex.x, y: vertex.y };
    }
}
exports.RightTriangle = RightTriangle;
class Slash extends Prediction {
    constructor(boundingBox, confidence, minimumBoundingBox) {
        super("Slash", boundingBox, confidence);
        this.minimumBoundingBox = minimumBoundingBox;
    }
}
exports.Slash = Slash;
class AxisZigZag extends Prediction {
    constructor(boundingBox, confidence) {
        super("AxisZigZag", boundingBox, confidence);
    }
}
exports.AxisZigZag = AxisZigZag;
class MultiZigZag extends Prediction {
    constructor(boundingBox, confidence) {
        super("MultiZigZag", boundingBox, confidence);
    }
}
exports.MultiZigZag = MultiZigZag;
class Staple extends Prediction {
    constructor(boundingBox, confidence) {
        super("Staple", boundingBox, confidence);
    }
}
exports.Staple = Staple;
class ShapePredictor {
    constructor(model) {
        this.xRes = 64;
        this.yRes = 64;
        this.model = model;
    }
    static async loadModel() {
        let model = await tf.loadLayersModel(new loadModel_1.RecognizerLoader());
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
        let normalizedPath = path.copy();
        normalizedPath.normalize();
        let image = normalizedPath.rastorizeRGB(this.xRes, this.yRes);
        let label = this.model.predict(image.data.reshape([1, this.xRes, this.yRes, 3]));
        let values = label.dataSync();
        let index = values.indexOf(Math.max(...values));
        let keyPoints = this.getKeyPoints(path, meta_1.labels[index]);
        values.sort((a, b) => (b - a));
        let maxConfidence = values[0];
        let minConfidence = Math.max(0, values[1]);
        let confidence = (maxConfidence - minConfidence) / maxConfidence;
        return this.returnAsShape(meta_1.labels[index], { x1: boundingBox.points[0].x, y1: boundingBox.points[0].y, x2: boundingBox.points[2].x, y2: boundingBox.points[2].y }, confidence, keyPoints);
    }
    returnAsShape(label, boundingBox, confidence, keyPoints) {
        switch (label) {
            case "RightTriangle":
                return new RightTriangle(boundingBox, confidence, keyPoints[0]);
            case "Ellipse":
                return new Ellipse(boundingBox, confidence);
            case "Rectangle":
                return new Rectangle(boundingBox, confidence);
            case "AxisZigZag":
                return new AxisZigZag(boundingBox, confidence);
            case "MultiZigZag":
                return new MultiZigZag(boundingBox, confidence);
            case "Slash":
                return new Slash(boundingBox, confidence, keyPoints);
            case "Staple":
                return new Staple(boundingBox, confidence);
        }
        throw "Label was not recognized";
    }
    getKeyPoints(path, label) {
        if (label == "RightTriangle") {
            return [path.getRightVertex()];
        }
        else if (label == "Slash") {
            return path.getMinimumBoundingBox().points;
        }
        else {
            return path.getAxisAlignedBoundingBox().points;
        }
    }
}
exports.ShapePredictor = ShapePredictor;
