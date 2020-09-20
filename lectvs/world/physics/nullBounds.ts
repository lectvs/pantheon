class NullBounds implements Bounds {
    private position: Pt;
    private boundingBox: Rectangle;

    constructor() {
        this.position = { x: Infinity, y: Infinity };
        this.boundingBox = new Rectangle(Infinity, Infinity, 0, 0);
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
