import {ShapePredictor} from './index'

async function run(){
    let pred = await ShapePredictor.loadModel();
    pred.predict([{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}])
}

run();