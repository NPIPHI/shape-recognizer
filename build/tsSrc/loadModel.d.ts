/// <reference types="node" />
import * as tf from "@tensorflow/tfjs-core/dist/io/types";
export declare class RecognizerLoader implements tf.IOHandler {
    private isBrowser;
    constructor();
    save(): Promise<tf.SaveResult>;
    load(): Promise<tf.ModelArtifacts>;
    base64ToBuffer(base64: string): ArrayBuffer | Buffer;
}
