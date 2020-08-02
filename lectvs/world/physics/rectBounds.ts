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
        this.boundingBox = new Rectangle(x, y, width, height);
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

    getRaycastCollision(dx: number, dy: number, other: Bounds, otherdx: number, otherdy: number): Bounds.RaycastCollision {
        if (!this.isOverlapping(other)) {
            return undefined;
        }

        if (!(other instanceof RectBounds)) return undefined;

        if (this.parent instanceof Box) {
            //debug("d", dx, dy);
        }

        let box = this.getBoundingBox();
        box.x -= dx;
        box.y -= dy;
        let otherbox = other.getBoundingBox();
        otherbox.x -= otherdx;
        otherbox.y -= otherdy;

        let topbot_t = Infinity;
        let bottop_t = Infinity;
        let leftright_t = Infinity;
        let rightleft_t = Infinity;

        if (dy !== otherdy) {
            topbot_t = (box.top - otherbox.bottom) / (otherdy - dy);
            if (box.right + dx*topbot_t <= otherbox.left + otherdx*topbot_t || box.left + dx*topbot_t >= otherbox.right + otherdx*topbot_t) {
                topbot_t = Infinity;
            }

            bottop_t = (box.bottom - otherbox.top) / (otherdy - dy);
            if (box.right + dx*bottop_t <= otherbox.left + otherdx*bottop_t || box.left + dx*bottop_t >= otherbox.right + otherdx*bottop_t) {
                bottop_t = Infinity;
            }
        }
        
        if (dx !== otherdx) {
            leftright_t = (box.left - otherbox.right) / (otherdx - dx);
            if (box.bottom + dy*leftright_t <= otherbox.top + otherdy*leftright_t || box.top + dy*leftright_t >= otherbox.bottom + otherdy*leftright_t) {
                leftright_t = Infinity;
            }

            rightleft_t = (box.right - otherbox.left) / (otherdx - dx);
            if (box.bottom + dy*rightleft_t <= otherbox.top + otherdy*rightleft_t || box.top + dy*rightleft_t >= otherbox.bottom + otherdy*rightleft_t) {
                rightleft_t = Infinity;
            }
        }

        let min_t = Math.min(topbot_t, bottop_t, leftright_t, rightleft_t);

        if (min_t === Infinity) return undefined;

        let displacementX = 0;
        let displacementY = 0;

        let currentBox = this.getBoundingBox();
        let currentOtherBox = other.getBoundingBox();

        if (min_t === topbot_t) {
            displacementY = currentOtherBox.bottom - currentBox.top;
        } else if (min_t === bottop_t) {
            displacementY = currentOtherBox.top - currentBox.bottom;
        } else if (min_t === leftright_t) {
            displacementX = currentOtherBox.right - currentBox.left;
        } else if (min_t === rightleft_t) {
            displacementX = currentOtherBox.left - currentBox.right;
        }

        // if (min_t === topbot_t || min_t === bottop_t) {
        //     displacementY = M.argmin([currentOtherBox.bottom - currentBox.top, currentOtherBox.top - currentBox.bottom], Math.abs);
        // }
        // if (min_t === leftright_t || min_t === rightleft_t) {
        //     displacementX = M.argmin([currentOtherBox.right - currentBox.left, currentOtherBox.left - currentBox.right], Math.abs);
        // }

        if (displacementX !== 0 && displacementY !== 0) {
            error("Warning: rect displacement in both axes");
        }

        if (this.parent instanceof Box) {
            //debug("disp", displacementX, displacementY);
        }

        //debug(min_t);

        return {
            bounds1: this,
            bounds2: other,
            t: min_t,
        };
    }

    getDisplacementCollision(other: Bounds): Bounds.DisplacementCollision {
        if (!this.isOverlapping(other)) {
            return undefined;
        }

        if (!(other instanceof RectBounds)) return undefined;

        let currentBox = this.getBoundingBox();
        let currentOtherBox = other.getBoundingBox();

        let displacementX = M.argmin([currentOtherBox.right - currentBox.left, currentOtherBox.left - currentBox.right], Math.abs);
        let displacementY = M.argmin([currentOtherBox.bottom - currentBox.top, currentOtherBox.top - currentBox.bottom], Math.abs);

        if (Math.abs(displacementX) < Math.abs(displacementY)) {
            displacementY = 0;
        } else {
            displacementX = 0;
        }

        return {
            bounds1: this,
            bounds2: other,
            displacementX,
            displacementY,
        };
    }

    isOverlapping(other: Bounds) {
        if (!(other instanceof RectBounds)) return false;
        return G.overlapRectangles(this.getBoundingBox(), other.getBoundingBox());
    }
}
