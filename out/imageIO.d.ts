import { bwImage, RGBImage } from './image';
export declare function loadImage(path: string): Promise<unknown>;
export declare function saveImageList(images: bwImage[] | RGBImage[], name?: string): void;
