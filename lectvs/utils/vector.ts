class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
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
}