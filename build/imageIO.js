"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = require("./image");
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
function saveImageList(images, name = "untitled.png") {
    if (images.length) {
        if (images[0].depth == 1) {
            let encoding = "BW";
            let fullName = encoding + "_" + name + images.length + "_" + Math.floor(Math.random() * 10000) + ".png";
            image_1.bwImage.imageListToCanvas(images).then((canvas) => saveCanvas(canvas, fullName));
        }
        if (images[0].depth == 3) {
            let encoding = "RGB";
            let fullName = encoding + "_" + name + images.length + "_" + Math.floor(Math.random() * 10000) + ".png";
            image_1.RGBImage.imageListToCanvas(images).then((canvas) => saveCanvas(canvas, fullName));
        }
    }
}
exports.saveImageList = saveImageList;
function saveCanvas(canvas, name) {
    let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let link = document.createElement("a");
    link.setAttribute("download", name);
    link.setAttribute("href", image);
    link.click();
}
//# sourceMappingURL=imageIO.js.map