class CircleBounds implements Bounds {
    parent: Bounds.Parent;

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
        this.boundingBox = new Rectangle(0, 0, 0, 0);
    }

    clone(): CircleBounds {
        return new CircleBounds(this.x, this.y, this.radius, this.parent);
    }

    getCenter() {
        let x = this.parent ? this.parent.x : 0;
        let y = this.parent ? this.parent.y : 0;

        this.center.x = x + this.x;
        this.center.y = y + this.y;
        return this.center;
    }

    getBoundingBox(x?: number, y?: number) {
        x = x ?? (this.parent ? this.parent.x : 0);
        y = y ?? (this.parent ? this.parent.y : 0);

        this.boundingBox.x = x + this.x - this.radius;
        this.boundingBox.y = y + this.y - this.radius;
        this.boundingBox.width = this.radius*2;
        this.boundingBox.height = this.radius*2;
        return this.boundingBox;
    }

    getDisplacementCollision(other: Bounds): Bounds.DisplacementCollision {
        if (other instanceof RectBounds) return Bounds.Collision.getDisplacementCollisionCircleRect(this, other);
        if (other instanceof CircleBounds) return Bounds.Collision.getDisplacementCollisionCircleCircle(this, other);
        if (other instanceof SlopeBounds) return Bounds.Collision.getDisplacementCollisionCircleSlope(this, other);
        if (other instanceof InvertedRectBounds) return Bounds.Collision.getDisplacementCollisionCircleInvertedRect(this, other);
        if (other instanceof NullBounds) return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    }

    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision {
        if (other instanceof RectBounds) return Bounds.Collision.getRaycastCollisionCircleRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof CircleBounds) return Bounds.Collision.getRaycastCollisionCircleCircle(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof SlopeBounds) return Bounds.Collision.getRaycastCollisionCircleSlope(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof InvertedRectBounds) return Bounds.Collision.getRaycastCollisionCircleInvertedRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof NullBounds) return undefined;
        error("No collision supported between these bounds", this, other);
        return undefined;
    }

    isOverlapping(other: Bounds) {
        if (other instanceof RectBounds) return Bounds.Collision.isOverlappingCircleRect(this, other);
        if (other instanceof CircleBounds) return Bounds.Collision.isOverlappingCircleCircle(this, other);
        if (other instanceof SlopeBounds) return Bounds.Collision.isOverlappingCircleSlope(this, other);
        if (other instanceof InvertedRectBounds) return Bounds.Collision.isOverlappingCircleInvertedRect(this, other);
        if (other instanceof NullBounds) return undefined;
        error("No overlap supported between these bounds", this, other);
        return false;
    }

    raycast(x: number, y: number, dx: number, dy: number) {
        let center = this.getCenter();

        let a = dx**2 + dy**2;
        let b = 2*((x-center.x)*dx + (y-center.y)*dy);
        let c = (x-center.x)**2 + (y-center.y)**2 - this.radius**2;

        let disc = b**2 - 4*a*c;
        if (disc < 0) return Infinity;

        let small_t = (-b - Math.sqrt(disc)) / (2*a);
        let large_t = (-b + Math.sqrt(disc)) / (2*a);

        let t = small_t >= 0 ? small_t : large_t;
        if (t < 0) return Infinity;

        return t;
    }
}
