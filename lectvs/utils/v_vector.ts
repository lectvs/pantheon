namespace V {
    export function angle(vector: Pt) {
        var angle = Math.atan2(vector.y, vector.x);
        if (angle < 0) {
            angle += 2*Math.PI;
        }
        return angle;
    }

    export function clampMagnitude(v: Pt, magnitude: number) {
        if (magnitude >= 0 && V.magnitude(v) > magnitude) {
            setMagnitude(v, magnitude);
        } 
    }

    export function dot(v1: Pt, v2: Pt) {
        return v1.x*v2.x + v1.y*v2.y;
    }

    export function isZero(v: Pt) {
        return v.x === 0 && v.y === 0;
    }

    export function magnitude(vector: Pt) {
        return Math.sqrt(magnitudeSq(vector));
    }

    export function magnitudeSq(vector: Pt) {
        return vector.x*vector.x + vector.y*vector.y;
    }

    export function normalize(vector: Pt) {
        let mag = magnitude(vector);
        if (mag !== 0) {
            vector.x /= mag;
            vector.y /= mag;
        }
    }

    export function normalized(vector: Pt) {
        let mag = magnitude(vector);
        if (mag === 0) {
            return pt(0, 0);
        }
        return pt(vector.x / mag, vector.y / mag);
    }

    export function rotate(vector: Pt, angle: number) {
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        let x = vector.x;
        let y = vector.y;

        vector.x = cos * x - sin * y;
        vector.y = sin * x + cos * y;
    }

    export function rotated(vector: Pt, angle: number) {
        let result = pt(vector);
        rotate(result, angle);
        return result;
    }

    export function scale(vector: Pt, amount: number) {
        vector.x *= amount;
        vector.y *= amount;
    }

    export function scaled(vector: Pt, amount: number) {
        return pt(vector.x * amount, vector.y * amount);
    }

    export function setMagnitude(vector: Pt, magnitude: number) {
        normalize(vector);
        scale(vector, magnitude);
    }

    export function withMagnitude(vector: Pt, magnitude: number) {
        let result = normalized(vector);
        setMagnitude(result, magnitude);
        return result;
    }
}