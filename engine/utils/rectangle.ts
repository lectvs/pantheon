class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get left() { return this.x; }
    get right() { return this.x + this.width; }
    get top() { return this.y; }
    get bottom() { return this.y + this.height; }
    get centerX() { return this.x + this.width/2; }
    get centerY() { return this.y + this.height/2; }

    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    contains(x: Pt | number, y?: number) {
        if (typeof(x) !== 'number') {
            y = x.y;
            x = x.x;
        }
        y = y ?? x;
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
}
