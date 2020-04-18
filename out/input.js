"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("./point");
window.addEventListener("mousedown", (mouse) => {
    if (mouse.button == 0) {
        mouseObj.left = true;
    }
    if (mouse.button == 1) {
        mouseObj.right = true;
    }
});
window.addEventListener("mouseup", (mouse) => {
    if (mouse.button == 0) {
        mouseObj.left = false;
    }
    if (mouse.button == 1) {
        mouseObj.right = false;
    }
});
let mouseObj = { left: false, right: false, x: 0, y: 0 };
class drawingCanvas {
    constructor(width, height, outputResouluton) {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);
        this.ctx = canvas.getContext("2d");
        canvas.addEventListener("mousemove", (mouse) => this.mouseMove(this, mouse));
        window.addEventListener("mousedown", () => this.startDrawing(this));
        window.addEventListener("mouseup", () => this.endDrawing(this));
    }
    mouseMove(owner, m) {
        mouseObj.x = m.offsetX;
        mouseObj.y = m.offsetY;
        if (mouseObj.x >= 0 && mouseObj.x < owner.ctx.canvas.width &&
            mouseObj.y >= 0 && mouseObj.y < owner.ctx.canvas.height) {
            if (mouse().left) {
                owner.path.push(new point_1.Point(mouseObj.x, mouseObj.y));
                owner.ctx.lineTo(mouseObj.x, mouseObj.y);
                owner.ctx.stroke();
            }
        }
    }
    startDrawing(owner) {
        owner.ctx.beginPath();
        owner.ctx.clearRect(0, 0, owner.ctx.canvas.width, owner.ctx.canvas.height);
        owner.path = new point_1.PointPath([new point_1.Point(mouse().x, mouse().y)]);
        owner.ctx.moveTo(mouse().x, mouse().y);
    }
    endDrawing(owner) {
        if (owner.path.points.length > 1) {
            owner.path.normalize();
            owner.onFinishDrawing(owner.path);
        }
    }
    onFinishDrawing(ojb) {
    }
}
exports.drawingCanvas = drawingCanvas;
function mouse() {
    return mouseObj;
}
exports.mouse = mouse;
//# sourceMappingURL=input.js.map