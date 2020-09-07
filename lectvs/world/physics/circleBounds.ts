class CircleBounds implements Bounds {
    private parent: PhysicsWorldObject;

    x: number;
    y: number;
    radius: number;

    private center: Pt;
    private boundingBox: Rectangle;

    constructor(x: number, y: number, radius: number, parent?: PhysicsWorldObject) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.center = { x, y };
        this.boundingBox = new Rectangle(0, 0, 0, 0);
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
        return undefined;
    }

    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision {
        if (other instanceof RectBounds) return Bounds.Collision.getRaycastCollisionCircleRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof CircleBounds) return Bounds.Collision.getRaycastCollisionCircleCircle(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof SlopeBounds) return Bounds.Collision.getRaycastCollisionCircleSlope(this, dx, dy, other, otherdx, otherdy);
        return undefined;
    }

    isOverlapping(other: Bounds) {
        if (other instanceof RectBounds) return Bounds.Collision.isOverlappingCircleRect(this, other);
        if (other instanceof CircleBounds) return Bounds.Collision.isOverlappingCircleCircle(this, other);
        if (other instanceof SlopeBounds) return Bounds.Collision.isOverlappingCircleSlope(this, other);
        return false;
    }
}
