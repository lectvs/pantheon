class NullBounds implements Bounds {
    parent: Bounds.Parent;
    x: number;
    y: number;

    private boundingBox: Rectangle;

    constructor(parent?: Bounds.Parent) {
        this.parent = parent;
        this.x = 0;
        this.y = 0;
        this.boundingBox = new Rectangle(Infinity, Infinity, 0, 0);
    }

    clone(): NullBounds {
        return new NullBounds();
    }

    containsPoint(x: number | Pt, y?: number) {
        return false;
    }

    freeze() {
        // Noop
    }

    getBoundingBox() {
        return this.boundingBox;
    }

    getDisplacementCollision(other: Bounds): Bounds.DisplacementCollision {
        return undefined;
    }

    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision {
        return undefined;
    }

    isOverlapping(other: Bounds) {
        return false;
    }

    move(dx: number, dy: number) {
        // Noop
    }

    raycast(x: number, y: number, dx: number, dy: number) {
        return Infinity;
    }

    unfreeze() {
        // Noop
    }
}
