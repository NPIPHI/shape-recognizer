import * as tf from "@tensorflow/tfjs";
import { Point, PointPath } from "./point";
export { Point } from "./point";
export declare function sP(): Promise<shapePredictor>;
declare class shapePredictor {
    model: tf.LayersModel;
    private xRes;
    private yRes;
    constructor(model: tf.LayersModel);
    static init(): Promise<shapePredictor>;
    predict(shape: Point[] | PointPath): string;
}
