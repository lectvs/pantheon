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
            this.y += y ?? x;
        } else {
            this.x += x.x;
            this.y += x.y;
        }
        return this;
    }

    addMagnitude(amount: number) {
        return this.setMagnitude(this.magnitude + amount);
    }

    clampMagnitude(maxMagnitude: number): this;
    clampMagnitude(minMagnitude: number, maxMagnitude: number): this;
    clampMagnitude(minMagnitude: number, maxMagnitude?: number) {
        if (maxMagnitude === undefined) {
            maxMagnitude = minMagnitude;
            minMagnitude = 0;
        }

        if (maxMagnitude < minMagnitude) {
            console.error('Tried to clamp vector magnitude with maxMagnitude < minMagnitude');
            return this;
        }
        if (this.magnitude < minMagnitude) {
            this.setMagnitude(minMagnitude);
        } else if (this.magnitude > maxMagnitude) {
            this.setMagnitude(maxMagnitude);
        } 
        return this;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    divide(x: Pt | number, y?: number) {
        if (typeof(x) === 'number') {
            this.x /= x;
            this.y /= y ?? x;
        } else {
            this.x /= x.x;
            this.y /= x.y;
        }
        return this;
    }

    isZero() {
        return this.x === 0 && this.y === 0;
    }

    multiply(x: Pt | number, y?: number) {
        if (typeof(x) === 'number') {
            this.x *= x;
            this.y *= y ?? x;
        } else {
            this.x *= x.x;
            this.y *= x.y;
        }
        return this;
    }

    normalize() {
        let mag = this.magnitude;
        if (mag !== 0) {
            this.x /= mag;
            this.y /= mag;
        }
        return this;
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
        return this;
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
        return this;
    }

    rotated(angle: number) {
        let copy = this.clone();
        copy.rotate(angle);
        return copy;
    }

    set(x: number | Pt, y?: number) {
        if (!M.isNumber(x)) {
            y = x.y;
            x = x.x;
        }
        this.x = x;
        this.y = y ?? x;
        return this;
    }

    scale(amount: number) {
        this.x *= amount;
        this.y *= amount;
        return this;
    }

    scaled(amount: number) {
        let copy = this.clone();
        copy.scale(amount);
        return copy;
    }

    setMagnitude(magnitude: number) {
        this.normalize();
        this.scale(magnitude);
        return this;
    }

    subtract(x: Pt | number, y?: number) {
        if (typeof(x) === 'number') {
            this.x -= x;
            this.y -= y ?? x;
        } else {
            this.x -= x.x;
            this.y -= x.y;
        }
        return this;
    }

    toPolar() {
        return new Vector2Polar(this.angle, this.magnitude);
    }

    withMagnitude(magnitude: number) {
        let copy = this.clone();
        copy.setMagnitude(magnitude);
        return copy;
    }

    static fromPolar(radius: number, angle: number) {
        return new Vector2(radius * M.cos(angle), radius * M.sin(angle));
    }

    static add(v1: Pt, v2: Pt) {
        return vec2(v1.x + v2.x, v1.y + v2.y);
    }

    static subtract(v1: Pt, v2: Pt) {
        return vec2(v1.x - v2.x, v1.y - v2.y);
    }

    // Misc
    static get ZERO() { return new Vector2(0, 0); }
}

class Vector2Polar {
    angle: number;
    radius: number;

    constructor(angle: number, radius: number) {
        this.angle = angle;
        this.radius = radius;
    }

    scale(amount: number) {
        this.radius *= amount;
        return this;
    }

    toCartesian() {
        return Vector2.fromPolar(this.radius, this.angle);
    }
}

class Anchor {
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
    static get LEFT() { return new Vector2(0, 0.5); }
    static get RIGHT() { return new Vector2(1, 0.5); }

    static fromName(anchorName: string) {
        anchorName = anchorName.toLowerCase();

        let result = vec2(0.5, 0.5);

        if (anchorName.includes('left')) result.x = 0;
        else if (anchorName.includes('right')) result.x = 1;

        if (anchorName.includes('top')) result.y = 0;
        else if (anchorName.includes('bottom')) result.y = 1;

        return result;
    }
}

class Direction {
    static get UP_LEFT() { return new Vector2(-1, -1); }
    static get UP() { return new Vector2(0, -1); }
    static get UP_RIGHT() { return new Vector2(1, -1); }
    static get LEFT() { return new Vector2(-1, 0); }
    static get NONE() { return new Vector2(0, 0); }
    static get RIGHT() { return new Vector2(1, 0); }
    static get DOWN_LEFT() { return new Vector2(-1, 1); }
    static get DOWN() { return new Vector2(0, 1); }
    static get DOWN_RIGHT() { return new Vector2(1, 1); }

    static fromName(directionName: string) {
        directionName = directionName.toLowerCase();

        let result = vec2(0, 0);

        if (directionName.includes('left')) result.x = -1;
        else if (directionName.includes('right')) result.x = 1;

        if (directionName.includes('up')) result.y = -1;
        else if (directionName.includes('down')) result.y = 1;

        return result;
    }
}