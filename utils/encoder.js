fs = require("fs");
let buf = fs.readFileSync("C:/Users/16182/Documents/ShapeRecognizer/models/testing/group1-shard1of1.bin")
let base64 = buf.toString('base64');
fs.writeFileSync("C:/Users/16182/Documents/ShapeRecognizer/models/testing/binary.json", '{ "bin": "' + base64 + '"}', {encoding: "utf8"})

// model = require("../models/testing/model.json")
// tf = require("@tensorflow/tfjs")
// function load(){
//     return new Promise((resolve, reject)=>{
//         //let str = buf.toString("base64");
//         //let arrayBuffer = Buffer.from("ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD0000000000000000000000", 'base64');
//         let arrayBuffer = buf
//         let modelArtifact = {}
//         modelArtifact.convertedBy = model.convertedBy;
//         modelArtifact.format = model.format
//         modelArtifact.generatedBy = model.generatedBy
//         modelArtifact.modelTopology = model.modelTopology
//         modelArtifact.weightSpecs = model.weightsManifest[0].weights;
//         modelArtifact.weightData = arrayBuffer;
//         resolve(modelArtifact);
//     })
// }

// async function test(){
//     let nn = await tf.loadLayersModel("https://raw.githubusercontent.com/NPIPHI/shape-recognizer/master/models/testing/model.json");
//     let n2 = await tf.loadLayersModel({load: load});
//     let a = 0;
// }

// test();
