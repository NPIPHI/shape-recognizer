import * as tf from "@tensorflow/tfjs";
import { Point, PointPath } from "./point";
export { Point } from "./point";
export declare class ShapePredictor {
    model: tf.LayersModel;
    private xRes;
    private yRes;
    private constructor();
    static loadModel(): Promise<ShapePredictor>;
    predict(shape: Point[] | PointPath): string;
}
