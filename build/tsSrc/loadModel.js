"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model = __importStar(require("../models/recognizer/model.json"));
const bin = __importStar(require("../models/recognizer/binary.json"));
const atob_1 = __importDefault(require("atob"));
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
            var binary_string = atob_1.default(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
    }
}
exports.RecognizerLoader = RecognizerLoader;
