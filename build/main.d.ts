import * as tf from '@tensorflow/tfjs';
import { PointPath, Point } from "./point";
import { RGBImage } from './image';
export declare class shapePredictor {
    model: tf.LayersModel;
    private xRes;
    private yRes;
    constructor(model: tf.LayersModel);
    static init(): Promise<shapePredictor>;
    predict(shape: Point[] | PointPath | RGBImage): string;
}
