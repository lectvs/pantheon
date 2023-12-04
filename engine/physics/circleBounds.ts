class CircleBounds implements Bounds {
    parent?: Bounds.Parent;
    private frozen: boolean;

    x: number;
    y: number;
    radius: number;

    private center: Vector2;
    private boundingBox: Rectangle;

    private debugSprite: PIXI.Sprite;

    constructor(x: number, y: number, radius: number, parent?: Bounds.Parent) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.center = new Vector2(x, y);
        this.boundingBox = new Rectangle(0, 0, 0, 0);
        this.frozen = false;
        this.debugSprite = new PIXI.Sprite();
    }

    clone(): CircleBounds {
        return new CircleBounds(this.x, this.y, this.radius, this.parent);
    }

    containsPoint(x: number | Pt, y?: number) {
        if (!M.isNumber(x)) {
            y = x.y;
            x = x.x;
        }
        
        y = y ?? x;
        let center = this.getCenter();
        return M.distanceSq(center.x, center.y, x, y) <= this.radius * this.radius;
    }

    debugRender() {
        let center = this.getCenter();
        this.debugSprite.x = center.x;
        this.debugSprite.y = center.y;
        this.debugSprite.texture = Textures.outlineCircle(this.radius, 0x00FF00);
        return FrameCache.array(this.debugSprite);
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
        if (!this.frozen) {
            this.boundingBox.x = (this.parent ? this.parent.x : 0) + this.x - this.radius;
            this.boundingBox.y = (this.parent ? this.parent.y : 0) + this.y - this.radius;
            this.boundingBox.width = this.radius*2;
            this.boundingBox.height = this.radius*2;
        }
        return this.boundingBox;
    }

    getDisplacementCollision(other: Bounds) {
        if (other instanceof RectBounds) return Bounds.Collision.getDisplacementCollisionCircleRect(this, other);
        if (other instanceof CircleBounds) return Bounds.Collision.getDisplacementCollisionCircleCircle(this, other);
        if (other instanceof SlopeBounds) return Bounds.Collision.getDisplacementCollisionCircleSlope(this, other);
        if (other instanceof InvertedRectBounds) return Bounds.Collision.getDisplacementCollisionCircleInvertedRect(this, other);
        if (other instanceof InvertedCircleBounds) return Bounds.Collision.getDisplacementCollisionCircleInvertedCircle(this, other);
        if (other instanceof NullBounds) return undefined;
        console.error("No collision supported between these bounds", this, other);
        return undefined;
    }

    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number) {
        if (other instanceof RectBounds) return Bounds.Collision.getRaycastCollisionCircleRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof CircleBounds) return Bounds.Collision.getRaycastCollisionCircleCircle(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof SlopeBounds) return Bounds.Collision.getRaycastCollisionCircleSlope(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof InvertedRectBounds) return Bounds.Collision.getRaycastCollisionCircleInvertedRect(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof InvertedCircleBounds) return Bounds.Collision.getRaycastCollisionCircleInvertedCircle(this, dx, dy, other, otherdx, otherdy);
        if (other instanceof NullBounds) return undefined;
        console.error("No collision supported between these bounds", this, other);
        return undefined;
    }

    isOverlapping(other: Bounds) {
        if (other instanceof RectBounds) return Bounds.Collision.isOverlappingCircleRect(this, other);
        if (other instanceof CircleBounds) return Bounds.Collision.isOverlappingCircleCircle(this, other);
        if (other instanceof SlopeBounds) return Bounds.Collision.isOverlappingCircleSlope(this, other);
        if (other instanceof InvertedRectBounds) return Bounds.Collision.isOverlappingCircleInvertedRect(this, other);
        if (other instanceof InvertedCircleBounds) return Bounds.Collision.isOverlappingCircleInvertedCircle(this, other);
        if (other instanceof NullBounds) return false;
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

    unfreeze() {
        this.frozen = false;
    }
}
