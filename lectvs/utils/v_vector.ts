namespace V {
    export function angle(vector: Pt) {
        var angle = Math.atan2(vector.y, vector.x);
        if (angle < 0) {
            angle += 2*Math.PI;
        }
        return angle;
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
            return new Point(0, 0);
        }
        return new Point(vector.x / mag, vector.y / mag);
    }

    export function scale(vector: Pt, amount: number) {
        vector.x *= amount;
        vector.y *= amount;
    }

    export function scaled(vector: Pt, amount: number) {
        return new Point(vector.x * amount, vector.y * amount);
    }

    export function setMagnitude(vector: Pt, magnitude: number) {
        this.normalize(vector);
        this.scale(vector, magnitude);
    }
}