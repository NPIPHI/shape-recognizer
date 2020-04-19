"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input = require("./input");
const imageIO_1 = require("./imageIO");
const point_1 = require("./point");
const image_1 = require("./image");
const index_1 = require("./index");
const dataGenerator_1 = require("./dataGenerator");
const savedPaths = require("../pathData/paths.json");
const meta_1 = require("./meta");
const drawing = new input.drawingCanvas(720, 720, 32);
class imageType extends image_1.RGBImage {
}
const dataSaveMode = true;
const runModel = true;
let predictionElement;
let processedCanvas;
let predictor;
let prediction;
let dataSavingControls;
let lastPath;
index_1.ShapePredictor.loadModel().then((shapePredictor) => {
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
    console.log();
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
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
function getCurrentLabel() {
    let label = "NONE";
    for (let i = 0; i < meta_1.labels.length; i++) {
        if (dataSavingControls.options[i].checked) {
            label = meta_1.labels[i];
        }
    }
    return label;
}
function main() {
    drawing.onFinishDrawing = (path) => {
        lastPath = path.copy();
        if (dataSavingControls.activated.checked) {
            savedPaths.paths.push(imageIO_1.JSONify(path, getCurrentLabel()));
        }
        if (runModel) {
            prediction = predictor.predict(path);
            drawing.ctx.beginPath();
            drawing.ctx.moveTo(prediction.shape[prediction.shape.length - 1].x, prediction.shape[prediction.shape.length - 1].y);
            for (let i = 0; i < prediction.shape.length; i++) {
                drawing.ctx.lineTo(prediction.shape[i].x, prediction.shape[i].y);
            }
            drawing.ctx.stroke();
            predictionElement.innerHTML = prediction.label;
            console.log(prediction);
        }
        path.normalize();
        setCanvas(path.rastorizeRGB(meta_1.xRes, meta_1.yRes));
    };
    window.addEventListener('keydown', (key) => {
        if (key.key == "Enter") {
            download(JSON.stringify(savedPaths), "paths.json", 'text/json');
        }
        if (key.key == "Insert") {
            dataGenerator_1.saveSubsetPathData(["RTriangle"]);
        }
        if (key.key == "r") {
            predictor.predict(lastPath);
        }
    });
    let labelSelector = [];
    let selectorDiv = document.createElement("div");
    let activateSelectorHolder = document.createElement("div");
    activateSelectorHolder.innerHTML = "Activated: ";
    let activateSelector = document.createElement("input");
    activateSelector.type = "checkbox";
    activateSelectorHolder.appendChild(activateSelector);
    selectorDiv.appendChild(activateSelectorHolder);
    meta_1.labels.forEach(label => {
        let ele = document.createElement("div");
        ele.innerHTML = label;
        let selector = document.createElement("input");
        selector.type = "radio";
        selector.name = "classSelector";
        selector.label = label;
        ele.appendChild(selector);
        selectorDiv.appendChild(ele);
        labelSelector.push(selector);
    });
    document.body.appendChild(selectorDiv);
    let predictionDiv = document.createElement("div");
    predictionElement = document.createElement("div");
    predictionElement.innerHTML = "No shape yet";
    predictionDiv.appendChild(predictionElement);
    processedCanvas = document.createElement("canvas");
    predictionDiv.appendChild(processedCanvas);
    document.body.appendChild(predictionDiv);
    dataSavingControls = { activated: activateSelector, options: labelSelector };
}
//# sourceMappingURL=main.js.map