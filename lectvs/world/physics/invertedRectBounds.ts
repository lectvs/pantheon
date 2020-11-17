class InvertedRectBounds implements Bounds {
    parent: Bounds.Parent;

    x: number;
    y: number;
    width: number;
    height: number;

    private boundingBox: Rectangle;

    constructor(x: number, y: number, width: number, height: number, parent?: Bounds.Parent) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.boundingBox = new Rectangle(0, 0, 0, 0);
    }

    clone(): InvertedRectBounds {
        return new InvertedRectBounds(this.x, this.y, this.width, this.height, this.parent);
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
        if (other instanceof RectBounds) return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionRectInvertedRect(other, this));
        if (other instanceof CircleBounds) return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionCircleInvertedRect(other, this));
        if (other instanceof NullBounds) return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    }

    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision {
        if (other instanceof RectBounds) return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionRectInvertedRect(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof CircleBounds) return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionCircleInvertedRect(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof NullBounds) return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    }

    isOverlapping(other: Bounds) {
        if (other instanceof RectBounds) return Bounds.Collision.isOverlappingRectInvertedRect(other, this);
        if (other instanceof CircleBounds) return Bounds.Collision.isOverlappingCircleInvertedRect(other, this);
        if (other instanceof NullBounds) return undefined;
        error("No overlap supported between these bounds", this, other);
        return false;
    }

    raycast(x: number, y: number, dx: number, dy: number) {
        let box = this.getBoundingBox();

        if (dx === 0 && dy === 0) {
            return box.contains(x, y) ? Infinity : 0;
        }

        let left_t = dx < 0 && x >= box.left ? (box.left - x) / dx : Infinity;
        let right_t = dx > 0 && x <= box.right ? (box.right - x) / dx : Infinity;
        let top_t = dy < 0 && y >= box.top ? (box.top - y) / dy : Infinity;
        let bottom_t = dy > 0 && y <= box.bottom ? (box.bottom - y) / dy : Infinity;

        let t = Math.min(left_t, right_t, top_t, bottom_t);

        return t;
    }
}
