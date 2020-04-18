import { bwImage, RGBImage } from './image';
import { Point, PointPath } from "./point"

export function loadImage(path: string) {

    return new Promise((resolve, reject) => {
        let im = new Image();
        im.src = path;
        im.onload = ()=>{
            let renderCanvas = document.createElement("canvas");
            renderCanvas.width = im.width;
            renderCanvas.height = im.height;
            renderCanvas.getContext("2d").drawImage(im, 0, 0);
            var imageData = renderCanvas.getContext("2d").getImageData(0, 0, im.width, im.height);
            resolve(bwImage.fromImage(imageData));
        }
    })
}

export function saveImageList(images: bwImage[] | RGBImage[], name="untitled.png", randomId=true){
    if(images.length){
        let id = '0'
        if(randomId){
            id = ''+Math.floor(Math.random() * 10000);
        }
        if(images[0].depth == 1){
            let encoding = "BW"
            let fullName = encoding + "_" + name + images.length + "_" + Math.floor(Math.random() * 10000) + ".png";
            bwImage.imageListToCanvas(images as bwImage[]).then((canvas)=>saveCanvas(canvas, fullName));
        }
        if(images[0].depth == 3){
            let encoding = "RGB"
            let fullName = encoding + "_" + name + images.length + "_" + id + ".png";
            RGBImage.imageListToCanvas(images as RGBImage[]).then((canvas)=>saveCanvas(canvas, fullName));
        }
    }   
}

export function JSONify(path: PointPath, label: string){
    let xVals: Float64Array = new Float64Array(path.points.length);
    let yVals: Float64Array = new Float64Array(path.points.length);
    for(let i = 0; i < path.points.length; i++){
        xVals[i] = path.points[i].x;
        yVals[i] = path.points[i].y;
    }
    return {label, xVals, yVals};
}

export function parse(data: {label: string, xVals: Float64Array, yVals: Float64Array}[]): {path: PointPath, label: string}[]{
    let paths: {path: PointPath, label: string}[] = [];
    data.forEach(path=>{
        let points: Point[] = [];
        let xVals: number[] = [];
        let yVals: number[] = [];
        let index = 0;
        for(let x in path.xVals){
            xVals.push(path.xVals[x]);
        }
        for(let y in path.yVals){
            yVals.push(path.yVals[y]);
        }
        for(let i = 0; i < xVals.length; i++){
            points.push(new Point(xVals[i], yVals[i]))
        }
        paths.push({path: new PointPath(points), label: path.label})
    })
    return paths;
}

function saveCanvas(canvas: HTMLCanvasElement, name: string){
    let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let link = document.createElement("a");
    link.setAttribute("download", name);
    link.setAttribute("href", image)
    document.body.appendChild(link)
    link.click();
    setTimeout(function() {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(image);  
    }, 0);
}