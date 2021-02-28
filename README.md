# shape-recognizer
 
 Usage:
 ```
 npm install https://github.com/NPIPHI/shape-recognizer
 ```
 ```Javascript
 const { ShapePredictor } = require("shaperecognizer");

async function example(){
    let predictor = await ShapePredictor.loadModel();
    let path = [];
    for(let i = 0; i < 2 * Math.PI; i += 0.1){
        path.push({x : Math.cos(i), y: Math.sin(i)});
    }
    let prediction = predictor.predict(path);
    console.log(prediction);    
}
example();
```
Output:
```Javascript
Ellipse {
  label: 'Ellipse',
  boundingBox: {
    x1: -0.9991351502732795,
    y1: -0.9999232575641008,
    x2: 1,
    y2: 0.9995736030415051
  },
  confidence: 1,
  xRadius: 0.9995675751366397,
  yRadius: 0.999748430302803,
  center: { x: 0.000432424863360259, y: -0.00017482726129786075 }
}
```
note: 
If you are using typescript with this library you may have to add '"skipLibCheck": true' to your tsconfig.json. See this issue: https://github.com/tensorflow/tfjs/issues/2007
