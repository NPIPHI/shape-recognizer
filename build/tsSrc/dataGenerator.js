"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageIO_1 = require("./imageIO");
const meta_1 = require("./meta");
const syntheticOptions = { flip: true, rotate: true, rotateTheta: Math.PI / 2 };
async function pathsAsImages(filePath, filp = false, rotate = false) {
    let file = await fetch(filePath);
    let jsonObj = await file.json();
    let paths = imageIO_1.parse(jsonObj.paths);
    return paths;
}
async function exportPathsAsImages(paths) {
    let imageLists = Object();
    meta_1.labels.forEach(label => {
        imageLists[label] = [];
    });
    let index = 0;
    paths.forEach(path => {
        index++;
        console.log("working: " + index + "/" + paths.length);
        path.path.normalize();
        if (syntheticOptions.rotate) {
            for (let i = 0; i < Math.PI * 2 - 0.001; i += syntheticOptions.rotateTheta) {
                path.path.rotate(syntheticOptions.rotateTheta);
                path.path.normalize();
                imageLists[path.label].push(path.path.rastorizeRGB(64, 64));
            }
            if (syntheticOptions.flip) {
                path.path.flip();
                for (let i = 0; i < Math.PI * 2 - 0.001; i += syntheticOptions.rotateTheta) {
                    path.path.rotate(syntheticOptions.rotateTheta);
                    path.path.normalize();
                    imageLists[path.label].push(path.path.rastorizeRGB(64, 64));
                }
            }
        }
        else {
            imageLists[path.label].push(path.path.rastorizeRGB(64, 64));
            if (syntheticOptions.flip) {
                path.path.flip();
                path.path.normalize();
                imageLists[path.label].push(path.path.rastorizeRGB(64, 64));
            }
        }
    });
    for (let imageList in imageLists) {
        console.log("Saving: " + imageList);
        imageIO_1.saveImageList(imageLists[imageList], imageList, false);
    }
}
async function saveAllPathData() {
    console.log("loading Json");
    let pathlist = await pathsAsImages("../pathData/paths.json");
    console.log("Json Parsed");
    exportPathsAsImages(pathlist);
}
exports.saveAllPathData = saveAllPathData;
async function saveSubsetPathData(labels) {
    console.log("loading Json");
    let pathlist = await pathsAsImages("../pathData/paths.json");
    console.log("Json Parsed");
    exportPathsAsImages(pathlist.filter(path => { return labels.includes(path.label); }));
}
exports.saveSubsetPathData = saveSubsetPathData;
//# sourceMappingURL=dataGenerator.js.map