class Anchor {
    static get TOP_LEFT() { return { x: 0, y: 0}; }
    static get TOP_CENTER() { return { x: 0.5, y: 0}; }
    static get TOP_RIGHT() { return { x: 1, y: 0}; }
    static get CENTER_LEFT() { return { x: 0, y: 0.5}; }
    static get CENTER_CENTER() { return { x: 0.5, y: 0.5}; }
    static get CENTER_RIGHT() { return { x: 1, y: 0.5}; }
    static get BOTTOM_LEFT() { return { x: 0, y: 1}; }
    static get BOTTOM_CENTER() { return { x: 0.5, y: 1}; }
    static get BOTTOM_RIGHT() { return { x: 1, y: 1}; }

    static get TOP() { return this.TOP_CENTER; }
    static get CENTER() { return this.CENTER_CENTER; }
    static get BOTTOM() { return this.BOTTOM_CENTER; }
}