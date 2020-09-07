namespace SlopeBounds {
    export type Direction = 'upleft' | 'upright' | 'downleft' | 'downright';
}

class SlopeBounds implements Bounds {
    private parent: PhysicsWorldObject;

    x: number;
    y: number;
    width: number;
    height: number;
    direction: SlopeBounds.Direction;

    private boundingBox: Rectangle;

    constructor(x: number, y: number, width: number, height: number, direction: SlopeBounds.Direction, parent?: PhysicsWorldObject) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.direction = direction;
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
        if (other instanceof RectBounds) return Bounds.Collision.getDisplacementCollisionSlopeRect(this, other);
        if (other instanceof CircleBounds) return Bounds.Collision.getDisplacementCollisionSlopeCircle(this, other);
        return undefined;
    }

    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision {
        if (other instanceof RectBounds) return Bounds.Collision.getRaycastCollisionSlopeRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof CircleBounds) return Bounds.Collision.getRaycastCollisionSlopeCircle(this, dx, dy, other, otherdx, otherdy);
        return undefined;
    }

    isOverlapping(other: Bounds) {
        if (other instanceof RectBounds) return Bounds.Collision.isOverlappingRectSlope(other, this);
        if (other instanceof CircleBounds) return Bounds.Collision.isOverlappingCircleSlope(other, this);
        return false;
    }
}
