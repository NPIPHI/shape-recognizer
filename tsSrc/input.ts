import { Point, PointPath } from "./point"

window.addEventListener("mousedown", (mouse) => {
    if (mouse.button == 0) {
        mouseObj.left = true;
    }
    if (mouse.button == 1) {
        mouseObj.right = true;
    }
})

window.addEventListener("mouseup", (mouse) => {
    if (mouse.button == 0) {
        mouseObj.left = false;
    }
    if (mouse.button == 1) {
        mouseObj.right = false;
    }
})

let mouseObj = { left: false, right: false, x: 0, y: 0 };


export class drawingCanvas {
    ctx: CanvasRenderingContext2D;
    path: PointPath;
    constructor(width: number, height: number, outputResouluton: number) {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);
        this.ctx = canvas.getContext("2d");
        canvas.addEventListener("mousemove", (mouse)=>this.mouseMove(this, mouse))
        window.addEventListener("mousedown", ()=>this.startDrawing(this));
        window.addEventListener("mouseup", ()=>this.endDrawing(this));
    }

    private mouseMove(owner, m) {
        mouseObj.x = m.offsetX;
        mouseObj.y = m.offsetY;
        if (mouseObj.x >= 0 && mouseObj.x < owner.ctx.canvas.width &&
            mouseObj.y >= 0 && mouseObj.y < owner.ctx.canvas.height) {
            if (mouse().left) {
                owner.path.push(new Point(mouseObj.x, mouseObj.y));
                owner.ctx.lineTo(mouseObj.x, mouseObj.y);
                owner.ctx.stroke();
            }
        }

    }

    private startDrawing(owner: drawingCanvas) {
        owner.ctx.beginPath();
        owner.ctx.clearRect(0, 0, owner.ctx.canvas.width, owner.ctx.canvas.height);
        owner.path = new PointPath([new Point(mouse().x, mouse().y)]);
        owner.ctx.moveTo(mouse().x, mouse().y);
    }

    private endDrawing(owner: drawingCanvas) {
        if(owner.path.points.length>1){
            owner.path.normalize();
            owner.onFinishDrawing(owner.path);
        }
    }

    onFinishDrawing(any){
    }
}

export function mouse() {
    return mouseObj;
}