//https://www.tensorflow.org/js/guide
import * as tf from '@tensorflow/tfjs';
import * as input from "./input"
import { saveImageList } from "./imageIO"
import { PointPath, Point } from "./point"
import { bwImage, RGBImage } from './image';
export { Point } from "./point"


const drawing = new input.drawingCanvas(720, 720, 32);
let modelName = "accelerationTestingModel"
class imageType extends RGBImage{}
const dataSaveMode = true;
const runModel = true;
const xRes = 64, yRes = 64;
// const names = ["Rectangle", "Triangle", "Circle", "Squiggle", "Semi"];
const names = ["TB", "TBT", "Rectangle", "Triangle", "Circle"];
const labels = ["There and back", "there and back and there"];
let initilized: boolean = false;
let images: imageType[] = [];
let predictionElement: HTMLDivElement;
let processedCanvas: HTMLCanvasElement;
let lastImage: imageType;
let predictor: shapePredictor;

export class shapePredictor{
    model: tf.LayersModel;
    private xRes: number = 64;
    private yRes: number = 64;
    constructor(model: tf.LayersModel){
        this.model = model
    }
    static init(): Promise<shapePredictor>{
        return new Promise<shapePredictor>((resolve: any, reject: any)=>{
            tf.loadLayersModel("./models/" + modelName + "/model.json").then(
                (nn) => {
                    document.title = modelName;
                    console.log("loaded model");
                    resolve(new shapePredictor(nn));
                }
            )
        })
    }
    predict(shape: Point[] | PointPath | RGBImage){
        let image: imageType;
        if((shape as Point[]).map){
            image = (new PointPath(shape as Point[])).rastorizeRGB(xRes, yRes);
        } else if((shape as RGBImage).data) {
            image = shape as RGBImage;
        } else if((shape as PointPath).flip) {
            image = (shape as PointPath).rastorizeRGB(xRes, yRes);
        }
        let prediction = this.model.predict(image.data.reshape([1, xRes, yRes, 3])) as tf.Tensor;
        let values = prediction.dataSync();
        let index = values.indexOf(Math.max(...values));
        return names[index];
    }
}

shapePredictor.init().then((shapePredictor)=>{
    predictor = shapePredictor;
    main();
})

// function categorize(image: bwImage | RGBImage): string {
//     let prediction = model.predict(image.data.reshape([1, image.width, image.height, image.depth])) as tf.Tensor;
//     let values = prediction.dataSync();
//     let index = values.indexOf(Math.max(...values));
//     return names[index];
// }

function setCanvas(image: bwImage | RGBImage) {
    let ctx = processedCanvas.getContext("2d");
    ctx.clearRect(0, 0, image.width, image.height)
    image.putImageData(processedCanvas)
}

function shapeAnylsis(path: PointPath){
    let shapeType = predictor.predict(path);
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
            predictionElement.innerHTML = predictor.predict(lastImage);
        }
    }

    window.addEventListener('keydown', (key) => {
        if (key.key == "Enter") {
            let predictedType = predictor.predict(images[0])
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

