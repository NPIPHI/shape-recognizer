"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input = require("./input");
const imageIO_1 = require("./imageIO");
const point_1 = require("./point");
const image_1 = require("./image");
const index_1 = require("./index");
const drawing = new input.drawingCanvas(720, 720, 32);
class imageType extends image_1.RGBImage {
}
const dataSaveMode = true;
const runModel = true;
const xRes = 64, yRes = 64;
let initilized = false;
let images = [];
let predictionElement;
let processedCanvas;
let lastImage;
let predictor;
let predictedType;
index_1.shapePredictor.init().then((shapePredictor) => {
    predictor = shapePredictor;
    main();
});
function setCanvas(image) {
    let ctx = processedCanvas.getContext("2d");
    ctx.clearRect(0, 0, image.width, image.height);
    image.putImageData(processedCanvas);
}
function shapeAnylsis(path) {
    let shapeType = predictor.predict(path);
    let boundingBox;
    if (shapeType == "Rectangle") {
        boundingBox = new point_1.PointPath([new point_1.Point(0, 0), new point_1.Point(0, 1), new point_1.Point(1, 1), new point_1.Point(1, 0)]);
    }
    else if (shapeType == "Circle") {
        boundingBox = new point_1.PointPath([]);
        for (let i = 0; i < 40; i++) {
            boundingBox.push(new point_1.Point(1 / 2 + Math.cos(2 * Math.PI * i / 40) / 2, 1 / 2 + Math.sin(2 * Math.PI * i / 40) / 2));
        }
    }
    else if (shapeType == "Triangle") {
        boundingBox = new point_1.PointPath([new point_1.Point(0, 0), new point_1.Point(1, 0), new point_1.Point(0.5, 1)]);
    }
    else {
        boundingBox = new point_1.PointPath([new point_1.Point(0.5, 0), new point_1.Point(0.5, 1), new point_1.Point(0.5, 0.5), new point_1.Point(0, 0.5), new point_1.Point(1, 0.5), new point_1.Point(0.5, 0.5)]);
    }
    boundingBox.applyTransform(path.lastTranform.inverse());
    drawing.ctx.strokeStyle = "red";
    drawing.ctx.beginPath();
    drawing.ctx.moveTo(boundingBox.points[boundingBox.points.length - 1].x, boundingBox.points[boundingBox.points.length - 1].y);
    for (let i = 0; i < boundingBox.points.length; i++) {
        drawing.ctx.lineTo(boundingBox.points[i].x, boundingBox.points[i].y);
    }
    drawing.ctx.stroke();
    drawing.ctx.strokeStyle = "black";
}
function main() {
    drawing.onFinishDrawing = (path) => {
        lastImage = path.rastorizeRGB(xRes, yRes);
        setCanvas(lastImage);
        shapeAnylsis(path);
        if (dataSaveMode) {
            images.push(path.rastorizeRGB(xRes, yRes));
            images.push(path.flip().rastorizeRGB(xRes, yRes));
        }
        if (runModel) {
            predictedType = predictor.predict(path);
            predictionElement.innerHTML = predictedType;
        }
    };
    window.addEventListener('keydown', (key) => {
        if (key.key == "Enter") {
            imageIO_1.saveImageList(images, predictedType);
        }
        if (key.key == "Delete") {
            if (images.length) {
                images.pop();
                if (images.length) {
                    lastImage = images[images.length - 1];
                    setCanvas(lastImage);
                }
                predictionElement.innerHTML = "Cleared";
            }
        }
        if (key.key == "Shift") {
            let name = window.prompt("correct label?");
            imageIO_1.saveImageList([lastImage], name);
        }
    });
    predictionElement = document.createElement("div");
    predictionElement.innerHTML = "No shape yet";
    document.body.appendChild(predictionElement);
    processedCanvas = document.createElement("canvas");
    document.body.appendChild(processedCanvas);
}
//# sourceMappingURL=main.js.map