class Boundaries {
    left: number;
    right: number;
    top: number;
    bottom: number;

    constructor(left: number, right: number, top: number, bottom: number) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }

    get width() { return isFinite(this.left) && isFinite(this.right) ? this.right - this.left : Infinity; }
    get height() { return isFinite(this.top) && isFinite(this.bottom) ? this.bottom - this.top : Infinity; }
    get centerX() { return !isFinite(this.left) && !isFinite(this.right) ? 0 : (this.left + this.right)/2; }
    get centerY() { return !isFinite(this.top) && !isFinite(this.bottom) ? 0 : (this.top + this.bottom)/2; }

    clone() {
        return new Boundaries(this.left, this.right, this.top, this.bottom);
    }

    contains(x: Pt | number, y?: number) {
        if (typeof(x) !== 'number') {
            y = x.y;
            x = x.x;
        }
        y = y ?? x;
        return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
    }

    isFinite() {
        return isFinite(this.left) && isFinite(this.right) && isFinite(this.top) && isFinite(this.bottom);
    }
}