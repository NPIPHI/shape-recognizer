"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
async function run() {
    let pred = await index_1.ShapePredictor.loadModel();
    console.log(pred.predict([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }]));
}
run();
