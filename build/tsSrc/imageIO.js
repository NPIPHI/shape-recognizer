"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = require("./image");
const point_1 = require("./point");
function loadImage(path) {
    return new Promise((resolve, reject) => {
        let im = new Image();
        im.src = path;
        im.onload = () => {
            let renderCanvas = document.createElement("canvas");
            renderCanvas.width = im.width;
            renderCanvas.height = im.height;
            renderCanvas.getContext("2d").drawImage(im, 0, 0);
            var imageData = renderCanvas.getContext("2d").getImageData(0, 0, im.width, im.height);
            resolve(image_1.bwImage.fromImage(imageData));
        };
    });
}
exports.loadImage = loadImage;
function saveImageList(images, name = "untitled.png", randomId = true) {
    if (images.length) {
        let id = '0';
        if (randomId) {
            id = '' + Math.floor(Math.random() * 10000);
        }
        if (images[0].depth == 1) {
            let encoding = "BW";
            let fullName = encoding + "_" + name + images.length + "_" + Math.floor(Math.random() * 10000) + ".png";
            image_1.bwImage.imageListToCanvas(images).then((canvas) => saveCanvas(canvas, fullName));
        }
        if (images[0].depth == 3) {
            let encoding = "RGB";
            let fullName = encoding + "_" + name + images.length + "_" + id + ".png";
            image_1.RGBImage.imageListToCanvas(images).then((canvas) => saveCanvas(canvas, fullName));
        }
    }
}
exports.saveImageList = saveImageList;
function JSONify(path, label) {
    let xVals = new Float64Array(path.points.length);
    let yVals = new Float64Array(path.points.length);
    for (let i = 0; i < path.points.length; i++) {
        xVals[i] = path.points[i].x;
        yVals[i] = path.points[i].y;
    }
    return { label, xVals, yVals };
}
exports.JSONify = JSONify;
function parse(data) {
    let paths = [];
    data.forEach(path => {
        let points = [];
        let xVals = [];
        let yVals = [];
        let index = 0;
        for (let x in path.xVals) {
            xVals.push(path.xVals[x]);
        }
        for (let y in path.yVals) {
            yVals.push(path.yVals[y]);
        }
        for (let i = 0; i < xVals.length; i++) {
            points.push(new point_1.Point(xVals[i], yVals[i]));
        }
        paths.push({ path: new point_1.PointPath(points), label: path.label });
    });
    return paths;
}
exports.parse = parse;
function saveCanvas(canvas, name) {
    let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let link = document.createElement("a");
    link.setAttribute("download", name);
    link.setAttribute("href", image);
    document.body.appendChild(link);
    link.click();
    setTimeout(function () {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(image);
    }, 0);
}
//# sourceMappingURL=imageIO.js.map