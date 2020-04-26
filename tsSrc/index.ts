import * as tf from "@tensorflow/tfjs"
import {Point, PointPath} from "./point"
import {labels} from "./meta"
import {RecognizerLoader} from "./loadModel"
export {labels} from "./meta"

export class Prediction{
    label: string;
    boundingBox: {x1: number, y1: number, x2: number, y2: number};
    confidence: number;

    constructor(label: string, boundingBox: {x1: number, y1: number, x2: number, y2: number}, confidence: number){
        this.label = label;
        this.boundingBox = boundingBox;
        this.confidence = confidence;
    }
}

export class Ellipse extends Prediction{
    xRadius: number;
    yRadius: number;
    center: {x: number, y: number};
    constructor(boundingBox: {x1: number, y1: number, x2: number, y2: number}, confidence: number){
        super("Ellipse", boundingBox, confidence);
        this.xRadius = (boundingBox.x2 - boundingBox.x1)/2
        this.yRadius = (boundingBox.y2 - boundingBox.y1)/2
        this.center = {x: (boundingBox.x1 + boundingBox.x2)/2, y: (boundingBox.y1 + boundingBox.y2)/2};
    }
}

export class Rectangle extends Prediction{
    constructor(boundingBox: {x1: number, y1: number, x2: number, y2: number}, confidence: number){
        super("Rectangle", boundingBox, confidence);
    }
}

export class RightTriangle extends Prediction{
    rightVertex: {x: number, y: number}
    constructor(boundingBox: {x1: number, y1: number, x2: number, y2: number}, confidence: number, vertex: Point){
        super("RightTriangle", boundingBox, confidence);
        this.rightVertex = {x: vertex.x, y: vertex.y}
    }
}

export class Slash extends Prediction{
    minimumBoundingBox: {x: number, y: number}[] //array of four points describing the minimum bounds of the slash
    constructor(boundingBox: {x1: number, y1: number, x2: number, y2: number}, confidence: number, minimumBoundingBox: Point[]){
        super("Slash", boundingBox, confidence);
        this.minimumBoundingBox = minimumBoundingBox
    }
}

export class AxisZigZag extends Prediction{
    constructor(boundingBox: {x1: number, y1: number, x2: number, y2: number}, confidence: number){
        super("AxisZigZag", boundingBox, confidence);
    }
}

export class MultiZigZag extends Prediction{
    constructor(boundingBox: {x1: number, y1: number, x2: number, y2: number}, confidence: number){
        super("MultiZigZag", boundingBox, confidence);
    }
}

export class Staple extends Prediction{
    constructor(boundingBox: {x1: number, y1: number, x2: number, y2: number}, confidence: number){
        super("Staple", boundingBox, confidence);
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
    predict(shape: {x: number, y: number}[] | PointPath): Ellipse | Rectangle | RightTriangle | AxisZigZag | MultiZigZag | Staple | Slash{
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
    private anyaliseShape(path: PointPath): Ellipse | Rectangle | RightTriangle | AxisZigZag | MultiZigZag | Staple | Slash{
        let boundingBox = path.getAxisAlignedBoundingBox();
        let normalizedPath = path.copy()
        normalizedPath.normalize();
        let image = normalizedPath.rastorizeRGB(this.xRes, this.yRes);
        let label = this.model.predict(image.data.reshape([1, this.xRes, this.yRes, 3])) as tf.Tensor;
        let values = label.dataSync();
        let index = values.indexOf(Math.max(...values));

        let keyPoints = this.getKeyPoints(path, labels[index]);
        values.sort((a,b)=>(b-a));
        let maxConfidence = values[0];
        let minConfidence = Math.max(0, values[1])
        let confidence = (maxConfidence - minConfidence)/maxConfidence;
        return this.returnAsShape(labels[index], {x1: boundingBox.points[0].x, y1: boundingBox.points[0].y, x2: boundingBox.points[2].x, y2: boundingBox.points[2].y}, confidence, keyPoints)
        // return new Prediction(labels[index], {x1: boundingBox.points[0].x, y1: boundingBox.points[0].y, x2: boundingBox.points[2].x, y2: boundingBox.points[2].y}, center, confidence, keyPoints)
    }
    private returnAsShape(label: string, boundingBox: {x1: number, y1: number, x2: number, y2: number}, confidence: number, keyPoints: Point[]): Ellipse | Rectangle | RightTriangle | AxisZigZag | MultiZigZag | Staple | Slash{
        switch(label){
            case "RightTriangle":
                return new RightTriangle(boundingBox, confidence, keyPoints[0])
            case "Ellipse":
                return new Ellipse(boundingBox, confidence)
            case "Rectangle":
                return new Rectangle(boundingBox, confidence)
            case "AxisZigZag":
                return new AxisZigZag(boundingBox, confidence)
            case "MultiZigZag":
                return new MultiZigZag(boundingBox, confidence)
            case "Slash":
                return new Slash(boundingBox, confidence, keyPoints)
            case "Staple":
                return new Staple(boundingBox, confidence)
        }
        throw "Label was not recognized"
    }
    private getKeyPoints(path: PointPath, label: String): Point[]{
        if(label=="RightTriangle"){
            return [path.getRightVertex()];
        } else if(label=="Slash"){
            return path.getMinimumBoundingBox().points
        } else {
            return path.getAxisAlignedBoundingBox().points;
        }
    }
}