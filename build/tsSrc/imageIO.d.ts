import { bwImage, RGBImage } from './image';
import { PointPath } from "./point";
export declare function loadImage(path: string): Promise<unknown>;
export declare function saveImageList(images: bwImage[] | RGBImage[], name?: string, randomId?: boolean): void;
export declare function JSONify(path: PointPath, label: string): {
    label: string;
    xVals: Float64Array;
    yVals: Float64Array;
};
export declare function parse(data: {
    label: string;
    xVals: Float64Array;
    yVals: Float64Array;
}[]): {
    path: PointPath;
    label: string;
}[];
