export declare const EPSILON = 0.0001;
export declare const COSPI4: number;
export declare function NULL_VEC(): Vector;
export interface Point {
    x: number;
    y: number;
}
export interface Vector {
    x: number;
    y: number;
}
export interface AARect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface AABox {
    x: number;
    y: number;
    halfDimX: number;
    halfDimY: number;
}
export interface Circle {
    x: number;
    y: number;
    radius: number;
}
export declare function pointInAARect(point: Point, rect: AARect): boolean;
export declare function pointInAABox(point: Point, rect: AABox): boolean;
export declare function pointInCircle(point: Point, circle: Circle): boolean;
export declare function aaRectToRectOverlap(rect1: AARect, rect2: AARect): boolean;
export declare function aaBoxToBoxOverlap(box1: AABox, box2: AABox): boolean;
export declare function circleToCircleOverlap(circle1: Circle, circle2: Circle): boolean;
export declare function circleToAARectOverlap(circle: Circle, rect: AARect): boolean;
export declare function circleToAABoxOverlap(circle: Circle, box: AABox): boolean;
export declare function translatePoint(point: Point, vector: Vector): Point;
export declare function translateAARect(rect: AARect, vector: Vector): AARect;
export declare function translateAABox(box: AABox, vector: Vector): AABox;
export declare function translateCircle(circle: Circle, vector: Vector): Circle;
export declare function aaRectToBox(rect: AARect): AABox;
export declare function aaRectToCircle(rect: AARect): Circle;
export declare function aaBoxToRect(box: AABox): AARect;
export declare function aaBoxToCircle(box: AABox): Circle;
export declare function circleToAARect(circle: Circle): AARect;
export declare function circleToAABox(circle: Circle): AABox;
export declare function distPointToAARect(point: Point, rect: AARect): number;
export declare function distPointToCircle(point: Point, circle: Circle): number;
export declare function distanceSq(point1: Point, point2: Point): number;
export declare function distance(point1: Point, point2: Point): number;
export declare function lengthSqVector(vector: Vector): number;
export declare function lengthVector(vector: Vector): number;
export declare function oppositeVector(vector: Vector): Vector;
export declare function addVectors(vec1: Vector, vec2: Vector): Vector;
export declare function subVectors(vec1: Vector, vec2: Vector): Vector;
export declare function multVectorByScalar(vector: Vector, k: number): Vector;
export declare function scaleVector(vector: Vector, length: number): Vector;
export declare function divVectorByScalar(vector: Vector, k: number): Vector;
export declare function normalizeVector(vector: Vector): Vector;
export declare function limitVector(vector: Vector, maxLength: number): Vector;
export declare function dotProduct(vec1: Vector, vec2: Vector): number;
export declare function detVectors(vec1: Vector, vec2: Vector): number;
export declare function rotateVector(vector: Vector, angleRad: number): Vector;
export declare function tangentUnitVectorCircle(circle: Circle, outerPoint: Point): Vector;
export declare function tangentUnitVectorAABox(box: AABox, outerPoint: Point): Vector;
export declare function azimuthToAngle(azimuthRad: number): number;
export declare function angleToAzimuth(angleRad: number): number;
export declare function vectorToAngle(vector: Vector): number;
export declare function vectorToAzimuth(vector: Vector): number;
export declare function angleToVector(angleRad: number, length?: number): Vector;
export declare function angleToUnitVector(angleRad: number): Vector;
export declare function azimuthToVector(azimuthRad: number, length?: number): Vector;
export declare function azimuthToUnitVector(azimuthRad: number): Vector;
export declare function angleUnitVectors(vec1: Vector, vec2: Vector): number;
export declare function getRandomPoint(minX: number, maxX: number, minY: number, maxY: number): Point;
export declare function isPoint(obj: any): obj is Point;
export declare function isVector(obj: any): obj is Vector;
export declare function isAARect(obj: any): obj is AARect;
export declare function isAABox(obj: any): obj is AABox;
export declare function isCircle(obj: any): obj is Circle;
export declare function isNullVector(vector: Vector): boolean;
export declare function isOrthogonalVectors(vec1: Vector, vec2: Vector, tolerance?: number): boolean;
export declare function isColinearVectors(vec1: Vector, vec2: Vector, tolerance?: number): boolean;
export declare function isAlignedPoints(points: Point[]): boolean;
