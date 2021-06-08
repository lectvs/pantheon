class NullBounds implements Bounds {
    parent: Bounds.Parent;

    private position: Vector2;
    private boundingBox: Rectangle;

    constructor(parent?: Bounds.Parent) {
        this.parent = parent;
        this.position = new Vector2(Infinity, Infinity);
        this.boundingBox = new Rectangle(Infinity, Infinity, 0, 0);
    }

    clone(): NullBounds {
        return new NullBounds();
    }

    getPosition(x?: number, y?: number) {
        return this.position;
    }

    getBoundingBox(x?: number, y?: number) {
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
}
