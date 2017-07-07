// geometry2d.ts

export const EPSILON = 0.0001;
export const COSPI4 = Math.cos(Math.PI / 4);
export function NULL_VEC(): Vector { return { x: 0, y: 0 }; };

/**
 * 2D Point
 */
export interface Point {
    x: number;
    y: number;
} // Point

/**
 * 2D Vector
 */
export interface Vector {
    x: number;
    y: number;
} // Vector

/**
 * Axis-aligned rectangle
 */
export interface AARect {
    x: number; // top left corner
    y: number; // top left corner
    width: number;
    height: number;
} // AARect

/**
 * Axis-aligned box, centered with half dimensions
 */
export interface AABox {
    x: number; // center
    y: number; // center
    halfDimX: number;
    halfDimY: number;
} // AABox

/**
 * Circle
 */
export interface Circle {
    x: number; // center
    y: number; // center
    radius: number;
} // Circle

export function pointInAARect(point: Point, rect: AARect) {
    return point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height;
} // pointInAARectangle

export function pointInAABox(point: Point, rect: AABox) {
    return point.x >= rect.x - rect.halfDimX && point.x <= rect.x + rect.halfDimX && point.y >= rect.y - rect.halfDimY && point.y <= rect.y + rect.halfDimY;
} // pointInAARect

export function pointInCircle(point: Point, circle: Circle): boolean {
    return distanceSq(point, circle) <= circle.radius * circle.radius;
} // pointInCircle

/**
 *  Check the overlapping of two axis-aligned rectangles
 * 
 * @param {AARectangle} rect1 First axis-aligned rectangle
 * @param {AARectangle} rect2 Second axis-aligned rectangle
 * @returns {boolean} true if rect1 overlaps rect2, false otherwise
 */
export function aaRectToRectOverlap(rect1: AARect, rect2: AARect): boolean {
    return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y;
} // aaRectToRectOverlap

export function aaBoxToBoxOverlap(box1: AABox, box2: AABox): boolean {
    return Math.abs(box1.x - box2.x) < (box1.halfDimX + box2.halfDimX) && Math.abs(box1.y - box2.y) < (box1.halfDimY + box2.halfDimY);
} // aaBoxToBoxOverlap

/**
 *  Check the overlapping of two circles
 * 
 * @param {AARectangle} circle1 First circle
 * @param {AARectangle} circle2 Second circle
 * @returns {boolean} true if circle1 overlaps circle2, false otherwise
 */
export function circleToCircleOverlap(circle1: Circle, circle2: Circle): boolean {
    let dx = circle1.x - circle2.x;
    let dy = circle1.y - circle2.y;
    let distanceSq = dx * dx + dy * dy;
    let radiusSumSq = (circle1.radius + circle2.radius) * (circle1.radius + circle2.radius);
    return distanceSq <= radiusSumSq + EPSILON;
}

export function circleToAARectOverlap(circle: Circle, rect: AARect): boolean {
    // cf. http://gamedev.stackexchange.com/questions/44925/circle-rectangle-collision-in-2d-most-efficient-way
    /*
    let rBounds = rectBounds(rect);
    let cBounds = circleBounds(circle);
    if (!rectToRectOverlap(rBounds, cBounds)) return false;
    // cf. http://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
    */

    // cf. http://yal.cc/rectangle-circle-intersection-test/ + Use rectangle as coordinates ==> general solution

    // Only for axis aligned rectangle
    let dx = circle.x - Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    let dy = circle.y - Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    return (dx * dx + dy * dy) <= (circle.radius * circle.radius) + EPSILON;
}

export function circleToAABoxOverlap(circle: Circle, box: AABox): boolean {
    let dx = circle.x - Math.max(box.x - box.halfDimX, Math.min(circle.x, box.x + box.halfDimX));
    let dy = circle.y - Math.max(box.y - box.halfDimY, Math.min(circle.y, box.y + box.halfDimY));
    return (dx * dx + dy * dy) <= (circle.radius * circle.radius) + EPSILON;
}

export function translatePoint(point: Point, vector: Vector): Point {
    return addVectors(point, vector);
}

export function translateAARect(rect: AARect, vector: Vector): AARect {
    return { x: rect.x + vector.x, y: rect.y + vector.y, width: rect.width, height: rect.height };
}

export function translateAABox(box: AABox, vector: Vector): AABox {
    return { x: box.x + vector.x, y: box.y + vector.y, halfDimX: box.halfDimX, halfDimY: box.halfDimY };
}

export function translateCircle(circle: Circle, vector: Vector): Circle {
    return { x: circle.x + vector.x, y: circle.y + vector.y, radius: circle.radius };
}

export function aaRectToBox(rect: AARect): AABox {
    let halfDimX = rect.width / 2;
    let halfDimY = rect.height / 2;
    return {
        x: rect.x + halfDimX,
        y: rect.y + halfDimY,
        halfDimX: halfDimX,
        halfDimY: halfDimY
    };
}

export function aaRectToCircle(rect: AARect): Circle {
    let halfDimX = rect.width / 2;
    let halfDimY = rect.height / 2;
    return {
        x: rect.x + halfDimX,
        y: rect.y + halfDimY,
        radius: Math.max(halfDimX, halfDimY)
    };
}

export function aaBoxToRect(box: AABox): AARect {
    return {
        x: box.x - box.halfDimX,
        y: box.y - box.halfDimY,
        width: 2 * box.halfDimX,
        height: 2 * box.halfDimY
    };
}

export function aaBoxToCircle(box: AABox): Circle {
    return {
        x: box.x,
        y: box.y,
        radius: Math.max(box.halfDimX, box.halfDimY)
    };
}

export function circleToAARect(circle: Circle): AARect {
    return {
        x: circle.x - circle.radius,
        y: circle.y - circle.radius,
        width: 2 * circle.radius,
        height: 2 * circle.radius
    };
}

export function circleToAABox(circle: Circle): AABox {
    return {
        x: circle.x,
        y: circle.y,
        halfDimX: circle.radius,
        halfDimY: circle.radius
    };
}

export function distPointToAARect(point: Point, rect: AARect): number {
    let dx = Math.max(Math.abs(point.x - rect.x) - rect.width / 2, 0);
    let dy = Math.max(Math.abs(point.y - rect.y) - rect.height / 2, 0);
    return Math.sqrt(dx * dx + dy * dy);
}

export function distPointToCircle(point: Point, circle: Circle): number {
    return distance(point, circle) - circle.radius;
}

export function distanceSq(point1: Point, point2: Point): number {
    return (point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y);
}

export function distance(point1: Point, point2: Point): number {
    return Math.sqrt(distanceSq(point1, point2));
}

export function lengthSqVector(vector: Vector): number {
    return vector.x * vector.x + vector.y * vector.y;
}

export function lengthVector(vector: Vector): number {
    return Math.sqrt(lengthSqVector(vector));
}

export function oppositeVector(vector: Vector): Vector {
    return { x: -vector.x, y: -vector.y };
}

export function addVectors(vec1: Vector, vec2: Vector): Vector {
    return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

export function subVectors(vec1: Vector, vec2: Vector): Vector {
    return { x: vec1.x - vec2.x, y: vec1.y - vec2.y };
}

export function multVectorByScalar(vector: Vector, k: number): Vector {
    return { x: vector.x * k, y: vector.y * k };
}

export function scaleVector(vector: Vector, length: number): Vector {
    return multVectorByScalar(normalizeVector(vector), length);
}
export function divVectorByScalar(vector: Vector, k: number): Vector {
    return { x: vector.x / k, y: vector.y / k };
}

export function normalizeVector(vector: Vector): Vector {
    let norm = lengthVector(vector);
    if (norm > EPSILON) {
        return { x: vector.x / norm, y: vector.y / norm };
    }
    else {
        return NULL_VEC();
    }
}

export function limitVector(vector: Vector, maxLength: number): Vector {
    let length = lengthVector(vector);
    if (length > maxLength) {
        return scaleVector(vector, maxLength);
    }
    else {
        return vector;
    }
}

export function dotProduct(vec1: Vector, vec2: Vector): number {
    return vec1.x * vec2.x + vec1.y * vec2.y;
}

export function detVectors(vec1: Vector, vec2: Vector): number {
    return vec1.x * vec2.y - vec1.y * vec2.x;
}
export function rotateVector(vector: Vector, angleRad: number): Vector {
    let result = { x: 0, y: 0 };
    result.x = vector.x * Math.cos(angleRad) - vector.y * Math.sin(angleRad);
    result.y = vector.x * Math.sin(angleRad) + vector.y * Math.cos(angleRad);
    return result;
}

export function tangentUnitVectorCircle(circle: Circle, outerPoint: Point): Vector {
    let circleToOuterPoint = subVectors(outerPoint, circle);
    let tangent = { x: circleToOuterPoint.y, y: -circleToOuterPoint.x };
    return normalizeVector(tangent);
}

export function tangentUnitVectorAABox(box: AABox, outerPoint: Point): Vector {
    type Corner = { x: number, y: number, distanceSq: number };
    let corners: Corner[] = new Array(4);
    corners[0] = { x: box.x - box.halfDimX, y: box.y - box.halfDimY, distanceSq: 0 }; // Upper Left corner
    corners[1] = { x: box.x + box.halfDimX, y: box.y - box.halfDimY, distanceSq: 0 }; // Upper right corner
    corners[2] = { x: box.x + box.halfDimX, y: box.y + box.halfDimY, distanceSq: 0 }; // Lower right corner
    corners[3] = { x: box.x - box.halfDimX, y: box.y + box.halfDimY, distanceSq: 0 }; // Lower left corner
    for (let i = 0; i < 4; i++) {
        let corner = corners[i];
        corner.distanceSq = distanceSq(corner, outerPoint);
    } // for i
    corners.sort((a: Corner, b: Corner) => { return a.distanceSq - b.distanceSq; });
    let tangent = subVectors(corners[1], corners[0]);
    return normalizeVector(tangent);
}

export function azimuthToAngle(azimuthRad: number): number {
    let h = 2.5 * Math.PI - azimuthRad;
    if (h > 2 * Math.PI) {
        return h - 2 * Math.PI;
    }
    else {
        return h;
    }
}

export function angleToAzimuth(angleRad: number): number {
    return Math.PI / 2 - angleRad;
}

export function vectorToAngle(vector: Vector): number {
    return Math.atan2(vector.y, vector.x);
}

export function vectorToAzimuth(vector: Vector): number {
    let angle = vectorToAngle(vector);
    return angleToAzimuth(angle);
}

export function angleToVector(angleRad: number, length = 1): Vector {
    return multVectorByScalar(angleToUnitVector(angleRad), length);
}

export function angleToUnitVector(angleRad: number): Vector {
    return { x: Math.cos(angleRad), y: Math.sin(angleRad) };
}

export function azimuthToVector(azimuthRad: number, length = 1): Vector {
    return multVectorByScalar(azimuthToUnitVector(azimuthRad), length);
}

export function azimuthToUnitVector(azimuthRad: number): Vector {
    let angle = azimuthToAngle(azimuthRad);
    return { x: Math.cos(angle), y: Math.sin(angle) };
}

export function angleUnitVectors(vec1: Vector, vec2: Vector): number {
    let angle = Math.atan2(detVectors(vec1, vec2), dotProduct(vec1, vec2));
    return angle;
}

export function getRandomPoint(minX: number, maxX: number, minY: number, maxY: number): Point {
    return { x: Math.random() * maxX + minX, y: Math.random() * maxY + minY };
}

export function isPoint(obj: any): obj is Point {
    return "x" in obj && "y" in obj;
}

export function isVector(obj: any): obj is Vector {
    return "x" in obj && "y" in obj;
}

export function isAARect(obj: any): obj is AARect {
    return "x" in obj && "y" in obj && "width" in obj && "height" in obj;
}

export function isAABox(obj: any): obj is AABox {
    return "x" in obj && "y" in obj && "halfDimX" in obj && "halfDimY" in obj;
}

export function isCircle(obj: any): obj is Circle {
    return "x" in obj && "y" in obj && "radius" in obj;
}

export function isNullVector(vector: Vector): boolean {
    return Math.abs(vector.x) <= EPSILON && Math.abs(vector.y) <= EPSILON;
}

export function isOrthogonalVectors(vec1: Vector, vec2: Vector, tolerance = 0): boolean {
    return Math.abs(dotProduct(vec1, vec2)) <= EPSILON + tolerance;
}

export function isColinearVectors(vec1: Vector, vec2: Vector, tolerance = 0): boolean {
    return Math.abs(detVectors(vec1, vec2)) <= EPSILON + tolerance;
}

export function isAlignedPoints(points: Point[]): boolean {
    let nbPoints = points.length;

    if (nbPoints <= 2) {
        return true;
    }

    for (let i = 0; i < nbPoints - 2; i++) {
        let vec1 = subVectors(points[i + 1], points[i]);
        let vec2 = subVectors(points[i + 2], points[i + 1]);
        if (!isColinearVectors(vec1, vec2)) {
            return false;
        }
    } // for i

    return true;
}