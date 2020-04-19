import * as tf from "@tensorflow/tfjs";
import { Point, PointPath } from "./point";
export declare class Prediction {
    label: string;
    boundingBox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    center: Point;
    confidence: number;
    shape: Point[];
    constructor(label: string, boundingBox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }, center: Point, confidence: number, shape: Point[]);
}
export declare class ShapePredictor {
    model: tf.LayersModel;
    private xRes;
    private yRes;
    private constructor();
    static loadModel(): Promise<ShapePredictor>;
    predict(shape: {
        x: number;
        y: number;
    }[] | PointPath): Prediction;
    private anyaliseShape;
    private getKeyPoints;
}
