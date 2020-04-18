"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tf = require("@tensorflow/tfjs");
const point_1 = require("./point");
var point_2 = require("./point");
exports.Point = point_2.Point;
const modelName = "accelerationTestingModel";
const labels = ["Zig", "ZigZag", "Rectangle", "Triangle", "Circle"];
class shapePredictor {
    constructor(model) {
        this.xRes = 64;
        this.yRes = 64;
        this.model = model;
    }
    static init() {
        return new Promise((resolve, reject) => {
            tf.loadLayersModel("./models/" + modelName + "/model.json").then((nn) => {
                document.title = modelName;
                console.log("loaded model");
                resolve(new shapePredictor(nn));
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
exports.shapePredictor = shapePredictor;
//# sourceMappingURL=index.js.map