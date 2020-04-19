import { parse, saveImageList} from "./imageIO"
import { PointPath } from "./point";
import { labels } from "./meta"

const syntheticOptions = {flip: true, rotate: true, rotateTheta: Math.PI/2}

async function pathsAsImages(filePath: string, filp=false, rotate=false){
    let file = await fetch(filePath);
    let jsonObj = await file.json();
    let paths = parse(jsonObj.paths);
    return paths;
}

async function exportPathsAsImages(paths: {label: string, path: PointPath}[]){
    let imageLists: any = Object();
    labels.forEach(label=>{
        imageLists[label] = []
    })
    let index = 0;
    paths.forEach(path=>{
        index ++;
        console.log("working: " + index + "/" + paths.length)
        path.path.normalize()
        if(syntheticOptions.rotate){
            for(let i = 0; i < Math.PI * 2 - 0.001; i+= syntheticOptions.rotateTheta){
                path.path.rotate(syntheticOptions.rotateTheta);
                path.path.normalize()
                imageLists[path.label].push(path.path.rastorizeRGB(64, 64));
            }
            if(syntheticOptions.flip){
                path.path.flip();
                for(let i = 0; i < Math.PI * 2 - 0.001; i+= syntheticOptions.rotateTheta){
                    path.path.rotate(syntheticOptions.rotateTheta);
                    path.path.normalize()
                    imageLists[path.label].push(path.path.rastorizeRGB(64, 64));
                }
            }
        } else {
            imageLists[path.label].push(path.path.rastorizeRGB(64, 64));
            if(syntheticOptions.flip){
                path.path.flip()
                path.path.normalize()
                imageLists[path.label].push(path.path.rastorizeRGB(64, 64));
            }  
        }
    })
    for(let imageList in imageLists){
        console.log("Saving: " + imageList);
        saveImageList(imageLists[imageList], imageList, false);
    }
}

export async function saveAllPathData(){
    console.log("loading Json")
    let pathlist = await pathsAsImages("../pathData/paths.json");
    console.log("Json Parsed")
    exportPathsAsImages(pathlist);
}

export async function saveSubsetPathData(labels: string[]){
    console.log("loading Json")
    let pathlist = await pathsAsImages("../pathData/paths.json");
    console.log("Json Parsed")
    exportPathsAsImages(pathlist.filter(path=>{return labels.includes(path.label)}));
}