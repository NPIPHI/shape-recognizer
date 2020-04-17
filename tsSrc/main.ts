//https://www.tensorflow.org/js/guide
import * as tf from '@tensorflow/tfjs';
import * as input from "./input"
import { saveImageList } from "./imageIO"
import { PointPath, Point } from "./point"
import { bwImage, RGBImage } from './image';

const drawing = new input.drawingCanvas(720, 720, 32);
let model: tf.LayersModel;
let modelName = "accelerationTestingModel"
class imageType extends RGBImage{}
const dataSaveMode = true;
const runModel = true;
const xRes = 64, yRes = 64;
// const names = ["Rectangle", "Triangle", "Circle", "Squiggle", "Semi"];
const names = ["TB", "TBT", "Rectangle", "Triangle", "Circle"]
const labels = ["There and back", "there and back and there"];

let loadModel = tf.loadLayersModel("./models/" + modelName + "/model.json").then(
    (nn) => {
        document.title = modelName;
        console.log("loaded model");
        model = nn;
        // model.predict(tf.fill([1, xRes, yRes, ], 0))
        main();
    }
);

let images: imageType[] = [];
let predictionElement: HTMLDivElement;
let processedCanvas: HTMLCanvasElement;
let lastImage: imageType;

function categorize(image: bwImage | RGBImage): string {
    let prediction = model.predict(image.data.reshape([1, image.width, image.height, image.depth])) as tf.Tensor;
    let values = prediction.dataSync();
    let index = values.indexOf(Math.max(...values));
    return names[index];
}

function setCanvas(image: bwImage | RGBImage) {
    let ctx = processedCanvas.getContext("2d");
    ctx.clearRect(0, 0, image.width, image.height)
    image.putImageData(processedCanvas)
}

function shapeAnylsis(path: PointPath){
    let shapeType = categorize(path.rastorizeRGB(xRes, yRes));
    let boundingBox: PointPath;
    if(shapeType=="Rectangle"){
        boundingBox = new PointPath([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(1, 0)]);
    }
    else if(shapeType=="Circle"){
        boundingBox = new PointPath([]);
        for(let i = 0; i < 40; i++){
            boundingBox.push(new Point(1/2+Math.cos(2*Math.PI * i /40)/2, 1/2+Math.sin(2*Math.PI * i /40)/2))
        }
    }
    else if(shapeType=="Triangle"){
        boundingBox = new PointPath([new Point(0,0), new Point(1, 0), new Point(0.5, 1)]);
    }
    else{
        boundingBox = new PointPath([new Point(0.5, 0), new Point(0.5, 1), new Point(0.5, 0.5), new Point(0, 0.5), new Point(1, 0.5), new Point(0.5, 0.5)]);
    }
    boundingBox.applyTransform(path.lastTranform.inverse());
    drawing.ctx.strokeStyle = "red";
    drawing.ctx.beginPath()
    drawing.ctx.moveTo(boundingBox.points[boundingBox.points.length-1].x, boundingBox.points[boundingBox.points.length-1].y)
    for(let i = 0; i < boundingBox.points.length; i ++){
        drawing.ctx.lineTo(boundingBox.points[i].x, boundingBox.points[i].y)
    }
    drawing.ctx.stroke()
    drawing.ctx.strokeStyle = "black";
}

function main() {//idk bad name

    drawing.onFinishDrawing = (path: PointPath) => {
        lastImage = path.rastorizeRGB(xRes, yRes);
        setCanvas(lastImage);
        shapeAnylsis(path);
        if (dataSaveMode) {
            images.push(path.rastorizeRGB(xRes, yRes));
            images.push(path.flip().rastorizeRGB(xRes, yRes));
        }
        if (runModel) {
            predictionElement.innerHTML = categorize(lastImage);
        }
    }

    window.addEventListener('keydown', (key) => {
        if (key.key == "Enter") {
            let predictedType = categorize(images[0])
            saveImageList(images, predictedType);
        }
        if (key.key == "Delete") {
            if (images.length) {
                images.pop();
                if (images.length) {
                    lastImage = images[images.length - 1]
                    setCanvas(lastImage)
                }
                predictionElement.innerHTML = "Cleared"
            }
        }
        if (key.key == "Shift"){
            let name = window.prompt("correct label?")
            saveImageList([lastImage], name)
        }
    })

    predictionElement = document.createElement("div");
    predictionElement.innerHTML = "No shape yet";
    document.body.appendChild(predictionElement);
    processedCanvas = document.createElement("canvas");
    document.body.appendChild(processedCanvas);

}

