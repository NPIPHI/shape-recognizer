import { bwImage, RGBImage } from "./image";
import * as tf from "@tensorflow/tfjs"

export class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    dist(point: Point): number {
        return Math.sqrt((this.x - point.x) * (this.x - point.x) + (this.y - point.y) * (this.y - point.y))
    }
    length(): number {
        return Math.sqrt((this.x) * (this.x) + (this.y) * (this.y))
    }
    inverse() {
        return new Point(1 / this.x, 1 / this.y);
    }
    timesEquals(delta: Point) {
        this.x *= delta.x;
        this.y *= delta.y;
    }
    times(scalar: number) {
        return new Point(this.x * scalar, this.y * scalar);
    }
    plusEquals(delta: Point) {
        this.x += delta.x;
        this.y += delta.y;
    }
    plus(delta: Point) {
        return new Point(this.x + delta.x, this.y + delta.y);
    }
    minusEquals(delta: Point) {
        this.x -= delta.x;
        this.y -= delta.y;
    }
    minus(delta: Point) {
        return new Point(this.x - delta.x, this.y - delta.y);
    }
    rotate(theta: number) {
        let sin = Math.sin(theta)
        let cos = Math.cos(theta);
        let x = this.x * cos + this.y * sin;
        let y = this.x * -sin + this.y * cos;
        this.x = x;
        this.y = y;
    }
    dot(vec: Point) {
        return this.x * vec.x + this.y * vec.y;
    }
    normalize(): Point {
        return this.times(1 / this.length())
    }
    angle(): number {
        return Math.atan2(this.y, this.x);
    }
    isShapePredictorPoint(): void {

    }
}

class Transform {
    offset: Point;
    scale: Point;
    theta: number;
    order: boolean;
    constructor(offset: Point, theta: number, scale: Point, order: boolean = true) {
        this.order = order;
        this.offset = offset;
        this.theta = theta;
        this.scale = scale;
    }
    inverse(): Transform {
        return new Transform(this.offset.times(-1), -this.theta, new Point(1 / this.scale.x, 1 / this.scale.y), false);
    }
}

export class PointPath {
    points: Point[];
    lastTranform: Transform;
    private length: number;
    private distances: number[];
    constructor(points: Point[]) {
        this.points = points;
        this.length = 0;
        this.distances = []
        for (let i = 0; i < points.length - 1; i++) {
            let dist = this.points[i].dist(this.points[i + 1]);
            this.length += dist;
            this.distances.push(dist);
        }
    }
    push(point: Point): void {
        this.points.push(point);
        if (this.points.length > 1) {
            let dist = this.points[this.points.length - 2].dist(point);
            this.length += dist;
            this.distances.push(dist);
        }
    }
    posAt(scalar: number): Point {
        let currentPos = 0;
        scalar *= this.length;
        for (let i = 0; i < this.distances.length; i++) {
            if (scalar < currentPos + this.distances[i]) {
                let leftDist = scalar - currentPos;
                let rightDist = this.distances[i] + currentPos - scalar;
                leftDist /= this.distances[i];
                rightDist /= this.distances[i];
                return this.points[i].times(rightDist).plus(this.points[i + 1].times(leftDist));
            } else {
                currentPos += this.distances[i];
            }
        }
    }
    speedAt(scalar: number): number {
        let currentPos = 0;
        scalar *= this.length;
        for (let i = 0; i < this.distances.length; i++) {
            if (scalar < currentPos + this.distances[i]) {
                return this.distances[i];
            } else {
                currentPos += this.distances[i];
            }
        }
    }
    accelerationAt(scalar: number): number {
        let currentPos = 0;
        scalar *= this.length;
        for (let i = 0; i < this.distances.length; i++) {
            if (scalar < currentPos + this.distances[i]) {
                if (i < this.distances.length - 1) {
                    return this.points[i].plus(this.points[i + 2]).minus(this.points[i + 1].times(2)).length();
                } else {
                    return 0;
                }
            } else {
                currentPos += this.distances[i];
            }
        }
    }
    normalize() {
        let transform = this.getNormalizeTranform();
        this.applyTransform(transform);
    }
    applyTransform(transform: Transform) {
        this.lastTranform = transform;
        if (transform.order) {
            this.points.forEach(point => {
                point.plusEquals(transform.offset);
                point.rotate(transform.theta);
                point.timesEquals(new Point(transform.scale.x, transform.scale.y));
            });
        } else {
            this.points.forEach(point => {
                point.timesEquals(new Point(transform.scale.x, transform.scale.y));
                point.rotate(transform.theta);
                point.plusEquals(transform.offset);
            });
        }
        this.length = 0;
        this.distances = []
        for (let i = 0; i < this.points.length - 1; i++) {
            let dist = this.points[i].dist(this.points[i + 1]);
            this.length += dist;
            this.distances.push(dist);
        }
    }
    rotate(theta: number) {
        this.points.forEach(point => {
            point.rotate(theta);
        })
    }
    getLength(): number {
        return this.length;
    }
    private getNormalizeTranform(): Transform {
        const maxRatio = 4
        // let boundingBox = this.getBoundingBox();
        // let offset = boundingBox.points[1];
        // let rot = boundingBox.points[0].minus(boundingBox.points[1]).angle();
        // let xDist = boundingBox.points[0].dist(boundingBox.points[1]);
        // let yDist = boundingBox.points[1].dist(boundingBox.points[2]);
        // return new Transform(offset.times(-1), rot, new Point(1 / xDist, 1 / yDist));
        let xVals = this.points.map(point => point.x);
        let yVals = this.points.map(point => point.y);
        let minX = Math.min(...xVals);
        let minY = Math.min(...yVals);
        let maxX = Math.max(...xVals);
        let maxY = Math.max(...yVals);
        let xDist = maxX - minX;
        let yDist = maxY - minY;
        if (xDist < yDist / maxRatio) {
            xDist = yDist / maxRatio
        }
        if (yDist < xDist / maxRatio) {
            yDist = xDist / maxRatio
        }
        return new Transform(new Point(-minX, -minY), 0, new Point(1 / xDist, 1 / yDist));
    }
    static unitSquare(): PointPath {
        return new PointPath([new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(0, 1)])
    }
    getAxisAlignedBoundingBox(): PointPath {
        let xVals = this.points.map(point => point.x);
        let yVals = this.points.map(point => point.y);
        let minX = Math.min(...xVals);
        let minY = Math.min(...yVals);
        let maxX = Math.max(...xVals);
        let maxY = Math.max(...yVals);
        return new PointPath([new Point(minX, minY), new Point(maxX, minY), new Point(maxX, maxY), new Point(minX, maxY)])
    }
    getMinimumRightTriangle(): PointPath {
        // let axies = [new Point(0, 1), new Point(1, 0), new Point(0, -1), new Point(-1, 0)];
        // let hull = this.hull();
        // let minArea = Infinity;
        // axies.forEach(axis=>{
        //     let minOnAxis = Math.min(...hull.points.map(point=>(point.dot(axis))))
        //     let perpAxis = new Point(-axis.y, axis.x)
        //     let minOnPerp = Math.min(...hull.points.map(point=>(point.dot(perpAxis))))
        //     let possibleExposedFaces = [];
        //     for(let i = 0; i < hull.points.length; i++){
        //         let p1 = hull.points[i];
        //         let p2 = hull.points[(i+1)%hull.points.length];
        //         let normal = new Point(-p2.y + p2.x, p2.x - p1.x)
        //         if(normal.dot(axis)>0&&normal.dot(perpAxis)>0){
        //             possibleExposedFaces.push(normal.normalize());
        //         }
        //     }
        //     possibleExposedFaces.forEach(normal=>{
        //         let maxPoint = Math.max(...hull.points.map(point=>(point.dot(normal))))
        //         let minPoint = (new Point(minOnAxis, minOnPerp).dot(normal))
        //     })
        // })

        //if axis aligned triangle, just normalise, test for missing corner
        let copyPath = this.copy();
        copyPath.normalize()
        let squarePoints = [new Point(1, 1), new Point(1, 0), new Point(0, 0), new Point(0, 1)]
        let axies = [new Point(0, 1), new Point(1, 0), new Point(0, -1), new Point(-1, 0)];
        let blendedAxis: Point[] = [];
        for(let i = 0; i < axies.length; i++){
            blendedAxis.push(axies[i].plus(axies[(i+1)%axies.length]));
        }
        for(let i = 0; i < 4; i ++){
            let maxDot = Math.max(...copyPath.points.map(point=>(point.dot(blendedAxis[i]))));
            if(squarePoints[i].dot(blendedAxis[i])-maxDot > 0.7){
                squarePoints.splice(i,1)
                let retPath = new PointPath(squarePoints);
                retPath.applyTransform(copyPath.lastTranform.inverse())
                return retPath;
            }
        }
        
        //couldn't find the right triangle
        let fallBackPath = new PointPath(squarePoints)
        fallBackPath.applyTransform(copyPath.lastTranform.inverse())
        return fallBackPath;
    }
    copy(): PointPath {
        let newPoints: Point[] = []
        this.points.forEach(point=>{
            newPoints.push(new Point(point.x, point.y))
        })
        return new PointPath(newPoints)
    }
    getMinimumBoundingBox(): PointPath {
        let minHull = this.hull();
        let minRectArea = Infinity;
        let minRect: Point[] = [];
        for (let i = 0; i < minHull.points.length; i++) {
            let p1 = minHull.points[i];
            let p2 = minHull.points[(i + 1) % minHull.points.length];
            let norm1 = (p1.minus(p2).normalize());
            let norm2 = new Point(norm1.y, -norm1.x);
            let norm1Min = Infinity, norm1Max = -Infinity, norm2Min = Infinity, norm2Max = -Infinity;
            minHull.points.forEach(p => {
                let n1 = norm1.dot(p);
                let n2 = norm2.dot(p);
                norm1Min = Math.min(n1, norm1Min);
                norm1Max = Math.max(n1, norm1Max);
                norm2Min = Math.min(n2, norm2Min);
                norm2Max = Math.max(n2, norm2Max);
            })
            let area = (norm1Max - norm1Min) * (norm2Max - norm2Min)
            if (area < minRectArea) {
                minRectArea = area;
                minRect = [];
                minRect.push(norm1.times(norm1Min).plus(norm2.times(norm2Min)));
                minRect.push(norm1.times(norm1Max).plus(norm2.times(norm2Min)));
                minRect.push(norm1.times(norm1Max).plus(norm2.times(norm2Max)));
                minRect.push(norm1.times(norm1Min).plus(norm2.times(norm2Max)));
            }
        }
        return new PointPath(minRect);
    }
    private hull(): PointPath {
        let minPoint = this.points[0];
        let maxPoint = this.points[0];
        this.points.forEach(point => {
            if (point.x < minPoint.x) {
                minPoint = point;
            }
            if (point.x > maxPoint.x) {
                maxPoint = point;
            }
        })
        let pointHull: Point[] = [];
        pointHull.push(minPoint)
        this.quickHall(minPoint, maxPoint, this.points, pointHull);
        this.quickHall(maxPoint, minPoint, this.points, pointHull);
        return new PointPath(pointHull);
    }
    private quickHall(p1: Point, p2: Point, checkPoints: Point[], retPoints: Point[]) {
        let validPoints: Point[] = [];
        let norm = (p1.minus(p2))
        norm = new Point(-norm.y, norm.x)
        let faceDot = norm.dot(p1);
        let maxDot = faceDot;
        let maxPoint;
        checkPoints.forEach(point => {
            let pointDot = norm.dot(point);
            if (pointDot > faceDot + 0.0001) {
                validPoints.push(point);
                if (pointDot > maxDot) {
                    maxDot = pointDot;
                    maxPoint = point;
                }
            }
        })
        if (maxPoint) {
            this.quickHall(p1, maxPoint, validPoints, retPoints);
            this.quickHall(maxPoint, p2, validPoints, retPoints);
        } else {
            retPoints.push(p2);
        }
    }
    rastorizeBW(xRes: number, yRes: number, blurRadius: number = 2): bwImage {
        const totalCushion = blurRadius;
        var bwImageData: Float32Array = new Float32Array(xRes * yRes);
        let max = 16 * blurRadius * blurRadius;
        for (let pathIndex = 0; pathIndex < this.length * 100; pathIndex++) {
            let point = this.posAt(pathIndex / (this.length * 100));
            let x = Math.floor(point.x * (xRes - 2 * totalCushion) + totalCushion)
            let y = Math.floor(point.y * (yRes - 2 * totalCushion) + totalCushion)
            for (let i = -blurRadius; i <= blurRadius; i++) {
                for (let j = -blurRadius; j <= blurRadius; j++) {
                    bwImageData[x + i + (y + j) * xRes] += (2 * blurRadius * blurRadius - i * i - j * j);
                }
            }
        }
        for (let i = 0; i < bwImageData.length; i++) {
            bwImageData[i] /= max;
            if (bwImageData[i] > 1) {
                bwImageData[i] = 1;
            }
        }
        return new bwImage(xRes, yRes, bwImageData);
    }
    rastorizeRGB(xRes: number, yRes: number, blurRadius: number = 2): RGBImage {
        //red channel is alpha
        //green channel is speed
        //blue channel is time
        const totalCushion = blurRadius;
        let RGBImageData: Float32Array = new Float32Array(xRes * yRes * 3)
        let alphaMax = 16 * blurRadius * blurRadius;
        let timeMax = 6
        let accelerationTotal = 0;
        for (let pathIndex = 0; pathIndex < this.length * 100; pathIndex++) {
            let point = this.posAt(pathIndex / (this.length * 100));
            let acceleration = this.accelerationAt(pathIndex / (this.length * 100))
            let x = Math.floor(point.x * (xRes - 2 * totalCushion) + totalCushion)
            let y = Math.floor(point.y * (yRes - 2 * totalCushion) + totalCushion)
            accelerationTotal += acceleration;
            for (let i = -blurRadius; i <= blurRadius; i++) {
                for (let j = -blurRadius; j <= blurRadius; j++) {
                    RGBImageData[(x + i + (y + j) * xRes) * 3] += (2 * blurRadius * blurRadius - i * i - j * j);
                    RGBImageData[(x + i + (y + j) * xRes) * 3 + 1] += acceleration * (2 * blurRadius * blurRadius - i * i - j * j) / (2 * blurRadius * blurRadius);
                    RGBImageData[(x + i + (y + j) * xRes) * 3 + 2] += (pathIndex / (this.length * 100)) * (2 * blurRadius * blurRadius - i * i - j * j) / (2 * blurRadius * blurRadius);
                }
            }
        }
        let accelerationMax = 10 * accelerationTotal / (this.length * 100);
        for (let i = 0; i < RGBImageData.length; i += 3) {
            RGBImageData[i] /= alphaMax;
            RGBImageData[i + 1] /= accelerationMax;
            RGBImageData[i + 2] /= timeMax;
            if (RGBImageData[i] > 1) {
                RGBImageData[i] = 1;
            }
            if (RGBImageData[i + 1] > 1) {
                RGBImageData[i + 1] = 1;
            }
            if (RGBImageData[i + 2] > 1) {
                RGBImageData[i + 2] = 1;
            }
        }
        // for (let i = 0; i < RGBImageData.length; i+=3){
        //     let value = RGBImageData[i+2]
        //     RGBImageData[i] = value;
        //     RGBImageData[i+1] = value;
        //     RGBImageData[i+2] = value;
        // }
        return new RGBImage(xRes, yRes, RGBImageData);
    }
    flip(): PointPath {
        let points: Point[] = [];
        this.points.forEach(point => {
            points.push(new Point(-point.x, point.y))
        })
        return new PointPath(points);
    }
}