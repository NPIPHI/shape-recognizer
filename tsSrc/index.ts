import * as tf from "@tensorflow/tfjs"
import {Point, PointPath} from "./point"
import {labels} from "./meta"
import {RecognizerLoader} from "./loadModel"

const modelName = "accelerationTestingModel"

export class Prediction{
    label: string;
    boundingBox: {x1: number, y1: number, x2: number, y2: number};
    center: Point;
    confidence: number;
    shape: Point[];

    constructor(label: string, boundingBox: {x1: number, y1: number, x2: number, y2: number}, center: Point, confidence: number, shape: Point[]){
        this.label = label;
        this.boundingBox = boundingBox;
        this.center = center;
        this.confidence = confidence;
        this.shape = shape;
    }
}

export class ShapePredictor{
    model: tf.LayersModel;
    private xRes: number = 64;
    private yRes: number = 64;
    private constructor(model: tf.LayersModel){
        this.model = model
    }
    static async loadModel(){
        //let model = await tf.loadLayersModel("../models/testing/model.json");
        // let model = await tf.loadLayersModel("../models/recognizer/model.json");
        let model = await tf.loadLayersModel(new RecognizerLoader())
        return new ShapePredictor(model);
    }
    predict(shape: {x: number, y: number}[] | PointPath): Prediction{
        let image;
        let path: PointPath;
        if((shape as Point[]).map){
            let pointShape = (shape as {x: number, y: number}[]).map((point)=>new Point(point.x, point.y))
            path = new PointPath(pointShape);
        } else if((shape as PointPath).flip) {
            path = shape as PointPath;
        }
        if(path.points.length>1){
            return this.anyaliseShape(path);
        } else {
            throw "Incomplete shape"
        }
    }
    private anyaliseShape(path: PointPath){
        let boundingBox = path.getAxisAlignedBoundingBox();
        let normalizedPath = path.copy()
        normalizedPath.normalize();
        let image = normalizedPath.rastorizeRGB(this.xRes, this.yRes);
        let label = this.model.predict(image.data.reshape([1, this.xRes, this.yRes, 3])) as tf.Tensor;
        let values = label.dataSync();
        let index = values.indexOf(Math.max(...values));

        let keyPoints = this.getKeyPoints(path, labels[index]);

        let center = new Point(0, 0);
        keyPoints.forEach(point=>center.plusEquals(point));
        center.timesEquals(new Point(1/keyPoints.length, 1/keyPoints.length));
        values.sort((a,b)=>(b-a));
        let maxConfidence = values[0];
        let minConfidence = Math.max(0, values[1])
        let confidence = (maxConfidence - minConfidence)/maxConfidence;
        return new Prediction(labels[index], {x1: boundingBox.points[0].x, y1: boundingBox.points[0].y, x2: boundingBox.points[2].x, y2: boundingBox.points[2].y}, center, confidence, keyPoints)
    }
    private getKeyPoints(path: PointPath, label: String): Point[]{
        if(label=="RTriangle"){
            return path.getMinimumRightTriangle().points;
        } else if(label=="Slash"){
            return path.getMinimumBoundingBox().points
        } else {
            return path.getAxisAlignedBoundingBox().points;
        }
    }
}