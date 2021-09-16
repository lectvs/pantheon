class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get angle() {
        let angle = M.atan2(this.y, this.x);
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }

    get magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    get magnitudeSq() {
        return this.x*this.x + this.y*this.y;
    }

    add(x: Pt | number, y?: number) {
        if (typeof(x) === 'number') {
            this.x += x;
            this.y += y;
        } else {
            this.x += x.x;
            this.y += x.y;
        }
    }

    clampMagnitude(maxMagnitude: number) {
        if (maxMagnitude < 0) {
            error('Tried to clamp vector magnitude with negative maxMagnitude');
            return;
        }
        if (this.magnitude > maxMagnitude) {
            this.setMagnitude(maxMagnitude);
        } 
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    divide(x: Pt | number, y?: number) {
        if (typeof(x) === 'number') {
            this.x /= x;
            this.y /= y;
        } else {
            this.x /= x.x;
            this.y /= x.y;
        }
    }

    isZero() {
        return this.x === 0 && this.y === 0;
    }

    multiply(x: Pt | number, y?: number) {
        if (typeof(x) === 'number') {
            this.x *= x;
            this.y *= y;
        } else {
            this.x *= x.x;
            this.y *= x.y;
        }
    }

    normalize() {
        let mag = this.magnitude;
        if (mag !== 0) {
            this.x /= mag;
            this.y /= mag;
        }
    }

    normalized() {
        let copy = this.clone();
        copy.normalize();
        return copy;
    }

    projectOnto(other: Vector2) {
        let factor = G.dot(this, other) / other.magnitudeSq;
        this.x = other.x * factor;
        this.y = other.y * factor;
    }

    projectedOnto(other: Vector2) {
        let copy = this.clone();
        copy.projectOnto(other);
        return copy;
    }

    rotate(angle: number) {
        let sin = M.sin(angle);
        let cos = M.cos(angle);
        let x = this.x;
        let y = this.y;

        this.x = cos * x - sin * y;
        this.y = sin * x + cos * y;
    }

    rotated(angle: number) {
        let copy = this.clone();
        copy.rotate(angle);
        return copy;
    }

    scale(amount: number) {
        this.x *= amount;
        this.y *= amount;
    }

    scaled(amount: number) {
        let copy = this.clone();
        copy.scale(amount);
        return copy;
    }

    setMagnitude(magnitude: number) {
        this.normalize();
        this.scale(magnitude);
    }

    subtract(x: Pt | number, y?: number) {
        if (typeof(x) === 'number') {
            this.x -= x;
            this.y -= y;
        } else {
            this.x -= x.x;
            this.y -= x.y;
        }
    }

    withMagnitude(magnitude: number) {
        let copy = this.clone();
        copy.setMagnitude(magnitude);
        return copy;
    }

    // Directions
    static get UP_LEFT() { return new Vector2(-1, -1); }
    static get UP() { return new Vector2(0, -1); }
    static get UP_RIGHT() { return new Vector2(1, -1); }
    static get LEFT() { return new Vector2(-1, 0); }
    static get NONE() { return new Vector2(0, 0); }
    static get RIGHT() { return new Vector2(1, 0); }
    static get DOWN_LEFT() { return new Vector2(-1, 1); }
    static get DOWN() { return new Vector2(0, 1); }
    static get DOWN_RIGHT() { return new Vector2(1, 1); }

    // Anchors
    static get TOP_LEFT() { return new Vector2(0, 0); }
    static get TOP_CENTER() { return new Vector2(0.5, 0); }
    static get TOP_RIGHT() { return new Vector2(1, 0); }
    static get CENTER_LEFT() { return new Vector2(0, 0.5); }
    static get CENTER_CENTER() { return new Vector2(0.5, 0.5); }
    static get CENTER_RIGHT() { return new Vector2(1, 0.5); }
    static get BOTTOM_LEFT() { return new Vector2(0, 1); }
    static get BOTTOM_CENTER() { return new Vector2(0.5, 1); }
    static get BOTTOM_RIGHT() { return new Vector2(1, 1); }
    static get TOP() { return new Vector2(0.5, 0); }
    static get CENTER() { return new Vector2(0.5, 0.5); }
    static get BOTTOM() { return new Vector2(0.5, 1); }

    // Misc
    static get ZERO() { return new Vector2(0, 0); }
}