import { bwImage, RGBImage } from './image';
import { PointPath } from "./point";
export declare function loadImage(path: string): Promise<unknown>;
export declare function saveImageList(images: bwImage[] | RGBImage[], name?: string): void;
export declare function JSONify(path: PointPath, label: string): string;
