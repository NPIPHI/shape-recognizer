//https://www.tensorflow.org/js/guide
import * as tf from '@tensorflow/tfjs';
import * as input from "./input"
import { saveImageList, JSONify } from "./imageIO"
import { PointPath, Point } from "./point"
import { bwImage, RGBImage } from './image';
import {ShapePredictor, Prediction, RightTriangle} from "./index"
import {saveAllPathData, saveSubsetPathData} from "./dataGenerator"
import * as savedPaths from "../pathData/paths.json"
import {xRes, yRes, labels} from "./meta"


const drawing = new input.drawingCanvas(720, 720, 32);
class imageType extends RGBImage{}
const dataSaveMode = true;
const runModel = true;
let predictionElement: HTMLDivElement;
let processedCanvas: HTMLCanvasElement;
let predictor: any;
let prediction: Prediction;
let dataSavingControls: {activated: HTMLInputElement, options: HTMLInputElement[]}
let lastPath: PointPath;


ShapePredictor.loadModel().then((shapePredictor)=>{
    predictor = shapePredictor;
    main();
})

function setCanvas(image: bwImage | RGBImage) {
    let ctx = processedCanvas.getContext("2d");
    ctx.clearRect(0, 0, image.width, image.height)
    image.putImageData(processedCanvas)
}

function download(content: string, fileName: string, contentType: string) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function getCurrentLabel(): string{
    let label: string = "NONE";
    for(let i = 0; i < labels.length; i++){
        if(dataSavingControls.options[i].checked){
            label = labels[i];
        }
    }
    return label;
}

function main() {//idk bad name

    drawing.onFinishDrawing = (path: PointPath) => {
        // lastImage = path.rastorizeRGB(xRes, yRes);
        lastPath = path.copy();
        if (dataSavingControls.activated.checked) {
            savedPaths.paths.push(JSONify(path,getCurrentLabel()) as any);
            // images.push(path.rastorizeRGB(xRes, yRes));
            // images.push(path.flip().rastorizeRGB(xRes, yRes));
        }
        if (runModel) {
            prediction = predictor.predict(path);
            // drawing.ctx.beginPath();
            // drawing.ctx.moveTo(prediction.shape[prediction.shape.length-1].x, prediction.shape[prediction.shape.length-1].y);
            // for(let i = 0; i < prediction.shape.length; i++){
            //     drawing.ctx.lineTo(prediction.shape[i].x, prediction.shape[i].y);
            // }
            // drawing.ctx.stroke();
            if(prediction.label == "RightTriangle"){
                drawing.ctx.fillRect((prediction as RightTriangle).rightVertex.x, (prediction as RightTriangle).rightVertex.y, 5, 5)
            }
            predictionElement.innerHTML = prediction.label;
            console.log(prediction);
        }
        path.normalize()
        setCanvas(path.rastorizeRGB(xRes, yRes));
    }

    window.addEventListener('keydown', (key) => {
        if (key.key == "Enter") {
            download(JSON.stringify(savedPaths), "paths.json", 'text/json');
            // saveImageList(images, predictedType);
        }
        if (key.key == "Insert"){
            saveSubsetPathData(["Circle"]);
        }
        // if (key.key == "Delete") {
        //     if (images.length) {
        //         images.pop();
        //         if (images.length) {
        //             lastImage = images[images.length - 1]
        //             setCanvas(lastImage)
        //         }
        //         predictionElement.innerHTML = "Cleared"
        //     }
        // }
        // if (key.key == "Shift"){
        //     let name = window.prompt("correct label?")
        //     saveImageList([lastImage], name)
        // }
    })
    let labelSelector: HTMLInputElement[] = [];
    let selectorDiv = document.createElement("div");
    let activateSelectorHolder = document.createElement("div");
    activateSelectorHolder.innerHTML = "Activated: ";
    let activateSelector = document.createElement("input")
    activateSelector.type = "checkbox";
    activateSelectorHolder.appendChild(activateSelector);
    selectorDiv.appendChild(activateSelectorHolder);
    labels.forEach(label=>{
        let ele = document.createElement("div");
        ele.innerHTML = label;
        let selector = document.createElement("input") as any;
        selector.type = "radio"
        selector.name = "classSelector" 
        selector.label = label;
        ele.appendChild(selector);
        selectorDiv.appendChild(ele);
        labelSelector.push(selector);
    })
    document.body.appendChild(selectorDiv);
    let predictionDiv = document.createElement("div");
    predictionElement = document.createElement("div");
    predictionElement.innerHTML = "No shape yet";
    predictionDiv.appendChild(predictionElement);
    processedCanvas = document.createElement("canvas");
    predictionDiv.appendChild(processedCanvas);
    document.body.appendChild(predictionDiv);
    dataSavingControls = {activated: activateSelector, options: labelSelector}
}

