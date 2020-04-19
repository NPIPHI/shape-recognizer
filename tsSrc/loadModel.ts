import * as tf from "@tensorflow/tfjs-core/dist/io/types"
import * as model from "../models/recognizer/model.json"
import * as bin from "../models/recognizer/binary.json"

export class RecognizerLoader implements tf.IOHandler{
    private isBrowser: boolean;
    constructor(){
        this.isBrowser = !(typeof window === 'undefined');
    }
    save(): Promise<tf.SaveResult>{
        throw "This model is pretrained and cannot be saved"
    }
    load(): Promise<tf.ModelArtifacts>{
        return new Promise((resolve, reject)=>{
            let arrayBuffer = this.base64ToBuffer(bin.bin);
            let modelArtifact = {} as tf.ModelArtifacts
            modelArtifact.convertedBy = model.convertedBy;
            modelArtifact.format = model.format
            modelArtifact.generatedBy = model.generatedBy
            modelArtifact.modelTopology = model.modelTopology
            modelArtifact.weightSpecs = model.weightsManifest[0].weights as tf.WeightsManifestEntry[];
            modelArtifact.weightData = arrayBuffer;
            resolve(modelArtifact);
        })
    }
    base64ToBuffer(base64: string): ArrayBuffer | Buffer{
        if(this.isBrowser){
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        } else {
            return Buffer.from(base64, 'base64');
        }
    }
}