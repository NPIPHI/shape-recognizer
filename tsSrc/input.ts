import { Point, PointPath } from "./point"

window.addEventListener("pointerdown", (mouse) => {
    // if (mouse.button == 0) {
    //     mouseObj.left = true;
    // }
    // if (mouse.button == 1) {
    //     mouseObj.right = true;
    // }
    mouseObj.left = true;
})

window.addEventListener("pointerup", (mouse) => {
    // if (mouse.button == 0) {
    //     mouseObj.left = false;
    // }
    // if (mouse.button == 1) {
    //     mouseObj.right = false;
    // }
    mouseObj.left = false;
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
        canvas.addEventListener("pointermove", (mouse)=>this.mouseMove(this, mouse));
        canvas.addEventListener("pointerdown", ()=>this.startDrawing(this));
        canvas.addEventListener("pointerup", ()=>this.endDrawing(this));
    }

    private mouseMove(owner: drawingCanvas, m: any) {
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

    onFinishDrawing(ojb: any){
    }
}

export function mouse() {
    return mouseObj;
}