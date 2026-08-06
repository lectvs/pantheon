class CompositeBounds implements Bounds {
    parent?: Bounds.Parent;
    private frozen: boolean;

    x: number;
    y: number;
    private subBounds: Bounds[];

    private position: Vector2;
    private boundingBox: Rectangle;

    constructor(x: number, y: number, subBounds: Bounds[], parent?: Bounds.Parent) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.subBounds = A.clone(subBounds);
        this.position = new Vector2(x, y);
        for (let bounds of subBounds) {
            bounds.parent = this.position;
        }
        this.boundingBox = new Rectangle(0, 0, 0, 0);
        this.frozen = false;
    }

    clone(): CompositeBounds {
        return new CompositeBounds(this.x, this.y, this.subBounds, this.parent);
    }

    containsPoint(x: number | Pt, y?: number) {
        this.getPosition();  // Update pos

        for (let bounds of this.subBounds) {
            if (bounds.containsPoint(x, y)) {
                return true;
            }
        }

        return false;
    }

    debugRender() {
        this.getPosition();  // Update pos
        let result: Render.Result = FrameCache.array();
        for (let bounds of this.subBounds) {
            result.pushAll(bounds.debugRender());
        }
        return result;
    }

    freeze() {
        this.unfreeze();
        this.getPosition();
        this.getBoundingBox$();
        this.frozen = true;
        for (let bounds of this.subBounds) {
            bounds.freeze();
        }
    }

    getPosition() {
        if (!this.frozen) {
            this.position.x = (this.parent ? this.parent.x : 0) + this.x;
            this.position.y = (this.parent ? this.parent.y : 0) + this.y;
        }
        return this.position;
    }

    getBoundingBox$() {
        if (!this.frozen) {
            this.getPosition();  // Update pos
            if (this.subBounds.length === 0) {
                this.boundingBox.x = Infinity;
                this.boundingBox.y = Infinity;
                this.boundingBox.width = 0;
                this.boundingBox.height = 0;
            } else {
                this.boundingBox.set(this.subBounds[0].getBoundingBox$());
                for (let i = 1; i < this.subBounds.length; i++) {
                    G.expandRectangleToContain(this.boundingBox, this.subBounds[i].getBoundingBox$());
                }
            }
        }
        return this.boundingBox;
    }

    getDisplacementCollision$(other: Bounds) {
        console.error("No collision supported between these bounds", this, other);
        return undefined;
    }

    getRaycastCollision$(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number) {
        console.error("No collision supported between these bounds", this, other);
        return undefined;
    }

    isOverlapping(other: Bounds) {
        this.getPosition();  // Update pos
        for (let bounds of this.subBounds) {
            if (bounds.isOverlapping(other)) {
                return true;
            }
        }

        return false;
    }

    move(dx: number, dy: number) {
        let box = this.getBoundingBox$();
        box.x += dx;
        box.y += dy;
        let position = this.getPosition();
        position.x += dx;
        position.y += dy;
        for (let bounds of this.subBounds) {
            bounds.move(dx, dy);
        }
    }

    raycast(x: number, y: number, dx: number, dy: number) {
        this.getPosition();  // Update pos
        return M.min(this.subBounds, bounds => bounds.raycast(x, y, dx, dy)) || Infinity;
    }

    unfreeze() {
        this.frozen = false;
        for (let bounds of this.subBounds) {
            bounds.unfreeze();
        }
    }
}
