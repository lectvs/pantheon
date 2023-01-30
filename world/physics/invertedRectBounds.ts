class InvertedRectBounds implements Bounds {
    parent: Bounds.Parent;
    private frozen: boolean;

    x: number;
    y: number;
    width: number;
    height: number;

    private boundingBox: Rectangle;
    private innerBox: Rectangle;

    constructor(x: number, y: number, width: number, height: number, parent?: Bounds.Parent) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        // Big numbers because I don't trust Infinity :)
        this.boundingBox = new Rectangle(-1_000_000, -1_000_000, 2_000_000, 2_000_000);
        this.innerBox = new Rectangle(0, 0, 0, 0);
        this.frozen = false;
    }

    clone(): InvertedRectBounds {
        return new InvertedRectBounds(this.x, this.y, this.width, this.height, this.parent);
    }

    containsPoint(x: number | Pt, y?: number) {
        if (!_.isNumber(x)) {
            y = x.y;
            x = x.x;
        }

        return !this.getInnerBox().contains(x, y);
    }

    freeze() {
        this.frozen = false;
        this.getInnerBox();
        this.getBoundingBox();
        this.frozen = true;
    }

    getBoundingBox() {
        return this.boundingBox;
    }

    getInnerBox() {
        if (!this.frozen) {
            this.innerBox.x = (this.parent ? this.parent.x : 0) + this.x;
            this.innerBox.y = (this.parent ? this.parent.y : 0) + this.y;
            this.innerBox.width = this.width;
            this.innerBox.height = this.height;
        }
        return this.innerBox;
    }

    getDisplacementCollision(other: Bounds): Bounds.DisplacementCollision {
        if (other instanceof RectBounds) return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionRectInvertedRect(other, this));
        if (other instanceof CircleBounds) return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionCircleInvertedRect(other, this));
        if (other instanceof NullBounds) return undefined;
        console.error("No collision supported between these bounds", this, other);
        return undefined;
    }

    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision {
        if (other instanceof RectBounds) return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionRectInvertedRect(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof CircleBounds) return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionCircleInvertedRect(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof NullBounds) return undefined;
        console.error("No collision supported between these bounds", this, other);
        return undefined;
    }

    isOverlapping(other: Bounds) {
        if (other instanceof RectBounds) return Bounds.Collision.isOverlappingRectInvertedRect(other, this);
        if (other instanceof CircleBounds) return Bounds.Collision.isOverlappingCircleInvertedRect(other, this);
        if (other instanceof NullBounds) return undefined;
        console.error("No overlap supported between these bounds", this, other);
        return false;
    }

    move(dx: number, dy: number) {
        let box = this.getBoundingBox();
        box.x += dx;
        box.y += dy;
        let ibox = this.getInnerBox();
        ibox.x += dx;
        ibox.y += dy;
    }

    raycast(x: number, y: number, dx: number, dy: number) {
        let box = this.getInnerBox();

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

    unfreeze() {
        this.frozen = false;
    }
}
