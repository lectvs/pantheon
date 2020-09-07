class RectBounds implements Bounds {
    private parent: PhysicsWorldObject;

    x: number;
    y: number;
    width: number;
    height: number;

    private boundingBox: Rectangle;

    constructor(x: number, y: number, width: number, height: number, parent?: PhysicsWorldObject) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.boundingBox = new Rectangle(0, 0, 0, 0);
    }

    getBoundingBox(x?: number, y?: number) {
        x = x ?? (this.parent ? this.parent.x : 0);
        y = y ?? (this.parent ? this.parent.y : 0);

        this.boundingBox.x = x + this.x;
        this.boundingBox.y = y + this.y;
        this.boundingBox.width = this.width;
        this.boundingBox.height = this.height;
        return this.boundingBox;
    }

    getDisplacementCollision(other: Bounds): Bounds.DisplacementCollision {
        if (other instanceof RectBounds) return Bounds.Collision.getDisplacementCollisionRectRect(this, other);
        if (other instanceof CircleBounds) return Bounds.Collision.getDisplacementCollisionRectCircle(this, other);
        if (other instanceof SlopeBounds) return Bounds.Collision.getDisplacementCollisionRectSlope(this, other);
        return undefined;
    }

    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision {
        if (other instanceof RectBounds) return Bounds.Collision.getRaycastCollisionRectRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof CircleBounds) return Bounds.Collision.getRaycastCollisionRectCircle(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof SlopeBounds) return Bounds.Collision.getRaycastCollisionRectSlope(this, dx, dy, other, otherdx, otherdy);
        return undefined;
    }

    isOverlapping(other: Bounds) {
        if (other instanceof RectBounds) return Bounds.Collision.isOverlappingRectRect(this, other);
        if (other instanceof CircleBounds) return Bounds.Collision.isOverlappingCircleRect(other, this);
        if (other instanceof SlopeBounds) return Bounds.Collision.isOverlappingRectSlope(this, other);
        return false;
    }
}
