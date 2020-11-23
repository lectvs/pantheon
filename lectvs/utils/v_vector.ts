namespace V {
    export function angle(vector: Pt) {
        var angle = Math.atan2(vector.y, vector.x);
        if (angle < 0) {
            angle += 2*Math.PI;
        }
        return angle;
    }

    export function dot(v1: Pt, v2: Pt) {
        return v1.x*v2.x + v1.y*v2.y;
    }

    export function isZero(v: Pt) {
        return v.x === 0 && v.y === 0;
    }

    export function magnitude(vector: Pt) {
        return Math.sqrt(this.magnitudeSq(vector));
    }

    export function magnitudeSq(vector: Pt) {
        return vector.x*vector.x + vector.y*vector.y;
    }

    export function normalize(vector: Pt) {
        let mag = this.magnitude(vector);
        if (mag !== 0) {
            vector.x /= mag;
            vector.y /= mag;
        }
    }

    export function normalized(vector: Pt) {
        let mag = this.magnitude(vector);
        if (mag === 0) {
            return pt(0, 0);
        }
        return pt(vector.x / mag, vector.y / mag);
    }

    export function scale(vector: Pt, amount: number) {
        vector.x *= amount;
        vector.y *= amount;
    }

    export function scaled(vector: Pt, amount: number) {
        return pt(vector.x * amount, vector.y * amount);
    }

    export function setMagnitude(vector: Pt, magnitude: number) {
        this.normalize(vector);
        this.scale(vector, magnitude);
    }
}