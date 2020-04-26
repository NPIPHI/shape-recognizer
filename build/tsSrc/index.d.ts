import * as tf from "@tensorflow/tfjs";
import { Point, PointPath } from "./point";
export { labels } from "./meta";
export declare class Prediction {
    label: string;
    boundingBox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    confidence: number;
    constructor(label: string, boundingBox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }, confidence: number);
}
export declare class Ellipse extends Prediction {
    xRadius: number;
    yRadius: number;
    center: {
        x: number;
        y: number;
    };
    constructor(boundingBox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }, confidence: number);
}
export declare class Rectangle extends Prediction {
    constructor(boundingBox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }, confidence: number);
}
export declare class RightTriangle extends Prediction {
    rightVertex: {
        x: number;
        y: number;
    };
    constructor(boundingBox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }, confidence: number, vertex: Point);
}
export declare class Slash extends Prediction {
    minimumBoundingBox: {
        x: number;
        y: number;
    }[];
    constructor(boundingBox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }, confidence: number, minimumBoundingBox: Point[]);
}
export declare class AxisZigZag extends Prediction {
    constructor(boundingBox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }, confidence: number);
}
export declare class MultiZigZag extends Prediction {
    constructor(boundingBox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }, confidence: number);
}
export declare class Staple extends Prediction {
    constructor(boundingBox: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }, confidence: number);
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
    }[] | PointPath): Ellipse | Rectangle | RightTriangle | AxisZigZag | MultiZigZag | Staple | Slash;
    private anyaliseShape;
    private returnAsShape;
    private getKeyPoints;
}
