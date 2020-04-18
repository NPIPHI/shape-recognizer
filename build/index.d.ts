import * as tf from "@tensorflow/tfjs";
import { Point, PointPath } from "./point";
export { Point } from "./point";
export declare function shapePredictor(): Promise<ShapePredictor>;
declare class ShapePredictor {
    model: tf.LayersModel;
    private xRes;
    private yRes;
    constructor(model: tf.LayersModel);
    predict(shape: Point[] | PointPath): string;
}
