class NullBounds implements Bounds {
    parent: Bounds.Parent;

    private boundingBox: Rectangle;

    constructor(parent?: Bounds.Parent) {
        this.parent = parent;
        this.boundingBox = new Rectangle(Infinity, Infinity, 0, 0);
    }

    clone(): NullBounds {
        return new NullBounds();
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

    raycast(x: number, y: number, dx: number, dy: number) {
        return Infinity;
    }

    unfreeze() {
        // Noop
    }
}
