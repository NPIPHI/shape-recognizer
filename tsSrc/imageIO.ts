import { bwImage, RGBImage } from './image';

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

export function saveImageList(images: bwImage[] | RGBImage[], name="untitled.png"){
    if(images.length){
        if(images[0].depth == 1){
            let encoding = "BW"
            let fullName = encoding + "_" + name + images.length + "_" + Math.floor(Math.random() * 10000) + ".png";
            bwImage.imageListToCanvas(images as bwImage[]).then((canvas)=>saveCanvas(canvas, fullName));
        }
        if(images[0].depth == 3){
            let encoding = "RGB"
            let fullName = encoding + "_" + name + images.length + "_" + Math.floor(Math.random() * 10000) + ".png";
            RGBImage.imageListToCanvas(images as RGBImage[]).then((canvas)=>saveCanvas(canvas, fullName));
        }
    }   
}

function saveCanvas(canvas: HTMLCanvasElement, name: string){
    let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let link = document.createElement("a");
    link.setAttribute("download", name);
    link.setAttribute("href", image)
    link.click();
}