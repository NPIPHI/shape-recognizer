"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = require("../models/testing/model.json");
const bin = require("../models/testing/binary.json");
class RecognizerLoader {
    constructor() {
        this.isBrowser = !(typeof window === 'undefined');
    }
    save() {
        throw "This model is pretrained and cannot be saved";
    }
    load() {
        return new Promise((resolve, reject) => {
            let arrayBuffer = this.base64ToBuffer(bin.bin);
            let modelArtifact = {};
            modelArtifact.convertedBy = model.convertedBy;
            modelArtifact.format = model.format;
            modelArtifact.generatedBy = model.generatedBy;
            modelArtifact.modelTopology = model.modelTopology;
            modelArtifact.weightSpecs = model.weightsManifest[0].weights;
            modelArtifact.weightData = arrayBuffer;
            resolve(modelArtifact);
        });
    }
    base64ToBuffer(base64) {
        if (this.isBrowser) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
        else {
            return Buffer.from(base64, 'base64');
        }
    }
}
exports.RecognizerLoader = RecognizerLoader;
//# sourceMappingURL=loadModel.js.map