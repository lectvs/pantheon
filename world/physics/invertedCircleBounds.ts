class InvertedCircleBounds implements Bounds {
    parent: Bounds.Parent;
    private frozen: boolean;

    x: number;
    y: number;
    radius: number;

    private center: Vector2;
    private boundingBox: Rectangle;

    constructor(x: number, y: number, radius: number, parent?: Bounds.Parent) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.center = new Vector2(x, y);
        // Big numbers because I don't trust Infinity :)
        this.boundingBox = new Rectangle(-1_000_000, -1_000_000, 2_000_000, 2_000_000);
        this.frozen = false;
    }

    clone(): InvertedCircleBounds {
        return new InvertedCircleBounds(this.x, this.y, this.radius, this.parent);
    }

    containsPoint(x: number | Pt, y?: number) {
        if (!_.isNumber(x)) {
            y = x.y;
            x = x.x;
        }

        let center = this.getCenter();
        return M.distanceSq(center.x, center.y, x, y) > this.radius * this.radius;
    }

    freeze() {
        this.frozen = false;
        this.getCenter();
        this.getBoundingBox();
        this.frozen = true;
    }

    getCenter() {
        if (!this.frozen) {
            this.center.x = (this.parent ? this.parent.x : 0) + this.x;
            this.center.y = (this.parent ? this.parent.y : 0) + this.y;
        }
        return this.center;
    }

    getBoundingBox() {
        return this.boundingBox;
    }

    getDisplacementCollision(other: Bounds): Bounds.DisplacementCollision {
        if (other instanceof RectBounds) return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionRectInvertedCircle(other, this));
        if (other instanceof CircleBounds) return Bounds.Collision.invertDisplacementCollision(Bounds.Collision.getDisplacementCollisionCircleInvertedCircle(other, this));
        if (other instanceof NullBounds) return undefined;
        console.error("No collision supported between these bounds", this, other);
        return undefined;
    }

    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision {
        if (other instanceof RectBounds) return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionRectInvertedCircle(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof CircleBounds) return Bounds.Collision.invertRaycastCollision(Bounds.Collision.getRaycastCollisionCircleInvertedCircle(other, otherdx, otherdy, this, dx, dy));
        if (other instanceof NullBounds) return undefined;
        console.error("No collision supported between these bounds", this, other);
        return undefined;
    }

    isOverlapping(other: Bounds) {
        if (other instanceof RectBounds) return Bounds.Collision.isOverlappingRectInvertedCircle(other, this);
        if (other instanceof CircleBounds) return Bounds.Collision.isOverlappingCircleInvertedCircle(other, this);
        if (other instanceof NullBounds) return undefined;
        console.error("No overlap supported between these bounds", this, other);
        return false;
    }

    move(dx: number, dy: number) {
        let box = this.getBoundingBox();
        box.x += dx;
        box.y += dy;
        let center = this.getCenter();
        center.x += dx;
        center.y += dy;
    }

    raycast(x: number, y: number, dx: number, dy: number) {
        let center = this.getCenter();

        if (dx === 0 && dy === 0) {
            return (x-center.x)**2 + (y-center.y)**2 <= this.radius**2 ? Infinity : 0;
        }

        let a = dx**2 + dy**2;
        let b = 2*((x-center.x)*dx + (y-center.y)*dy);
        let c = (x-center.x)**2 + (y-center.y)**2 - this.radius**2;

        let disc = b**2 - 4*a*c;
        if (disc < 0) return Infinity;

        let small_t = (-b - Math.sqrt(disc)) / (2*a);
        let large_t = (-b + Math.sqrt(disc)) / (2*a);

        let t = large_t;
        if (t < 0) return Infinity;

        return t;
    }

    unfreeze() {
        this.frozen = false;
    }
}
