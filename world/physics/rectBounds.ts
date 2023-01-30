class RectBounds implements Bounds {
    parent: Bounds.Parent;
    private frozen: boolean;

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
        this.frozen = false;
    }

    clone(): RectBounds {
        return new RectBounds(this.x, this.y, this.width, this.height, this.parent);
    }

    containsPoint(x: number | Pt, y?: number) {
        if (!_.isNumber(x)) {
            y = x.y;
            x = x.x;
        }

        return this.getBoundingBox().contains(x, y);
    }

    freeze() {
        this.frozen = false;
        this.getBoundingBox();
        this.frozen = true;
    }

    getBoundingBox() {
        if (!this.frozen) {
            this.boundingBox.x = (this.parent ? this.parent.x : 0) + this.x;
            this.boundingBox.y = (this.parent ? this.parent.y : 0) + this.y;
            this.boundingBox.width = this.width;
            this.boundingBox.height = this.height;
        }
        return this.boundingBox;
    }

    getDisplacementCollision(other: Bounds): Bounds.DisplacementCollision {
        if (other instanceof RectBounds) return Bounds.Collision.getDisplacementCollisionRectRect(this, other);
        if (other instanceof CircleBounds) return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionCircleRect(other, this));
        if (other instanceof SlopeBounds) return Bounds.Collision.getDisplacementCollisionRectSlope(this, other);
        if (other instanceof InvertedRectBounds) return Bounds.Collision.getDisplacementCollisionRectInvertedRect(this, other);
        if (other instanceof InvertedCircleBounds) return Bounds.Collision.getDisplacementCollisionRectInvertedCircle(this, other);
        if (other instanceof NullBounds) return undefined;
        console.error("No collision supported between these bounds", this, other);
        return undefined;
    }

    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision {
        if (other instanceof RectBounds) return Bounds.Collision.getRaycastCollisionRectRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof CircleBounds) return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionCircleRect(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof SlopeBounds) return Bounds.Collision.getRaycastCollisionRectSlope(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof InvertedRectBounds) return Bounds.Collision.getRaycastCollisionRectInvertedRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof InvertedCircleBounds) return Bounds.Collision.getRaycastCollisionRectInvertedCircle(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof NullBounds) return undefined;
        console.error("No collision supported between these bounds", this, other);
        return undefined;
    }

    isOverlapping(other: Bounds) {
        if (other instanceof RectBounds) return Bounds.Collision.isOverlappingRectRect(this, other);
        if (other instanceof CircleBounds) return Bounds.Collision.isOverlappingCircleRect(other, this);
        if (other instanceof SlopeBounds) return Bounds.Collision.isOverlappingRectSlope(this, other);
        if (other instanceof InvertedRectBounds) return Bounds.Collision.isOverlappingRectInvertedRect(this, other);
        if (other instanceof InvertedCircleBounds) return Bounds.Collision.isOverlappingRectInvertedCircle(this, other);
        if (other instanceof NullBounds) return undefined;
        console.error("No overlap supported between these bounds", this, other);
        return false;
    }

    move(dx: number, dy: number) {
        let box = this.getBoundingBox();
        box.x += dx;
        box.y += dy;
    }

    raycast(x: number, y: number, dx: number, dy: number) {
        let box = this.getBoundingBox();

        let top_t = Infinity;
        let bottom_t = Infinity;
        let left_t = Infinity;
        let right_t = Infinity;

        if (dy !== 0) {
            top_t = (box.top - y) / dy;
            if (x + dx*top_t < box.left || x + dx*top_t > box.right) top_t = Infinity;
            bottom_t = (box.bottom - y) / dy;
            if (x + dx*bottom_t < box.left || x + dx*bottom_t > box.right) bottom_t = Infinity;
        }

        if (dx !== 0) {
            left_t = (box.left - x) / dx;
            if (y + dy*left_t < box.top || y + dy*left_t > box.bottom) left_t = Infinity;
            right_t = (box.right - x) / dx;
            if (y + dy*right_t < box.top || y + dy*right_t > box.bottom) right_t = Infinity;
        }

        let horiz_small_t = Math.min(left_t, right_t);
        let horiz_large_t = Math.max(left_t, right_t);
        let horiz_t = horiz_small_t >= 0 ? horiz_small_t : horiz_large_t;

        let vert_small_t = Math.min(top_t, bottom_t);
        let vert_large_t = Math.max(top_t, bottom_t);
        let vert_t = vert_small_t >= 0 ? vert_small_t : vert_large_t;

        let small_t = Math.min(horiz_t, vert_t);
        let large_t = Math.max(horiz_t, vert_t);
        let t = small_t >= 0 ? small_t : large_t;
        if (t < 0) return Infinity;

        return t;
    }

    unfreeze() {
        this.frozen = false;
    }
}
