class Physics {
    static getCollision(obj: PhysicsWorldObject, from: PhysicsWorldObject): Physics.Collision {
        let dx1 = obj.x - obj.preMovementX;
        let dy1 = obj.y - obj.preMovementY;
        let dx2 = from.x - from.preMovementX;
        let dy2 = from.y - from.preMovementY;

        let b1 = obj.getWorldBounds(obj.preMovementX, obj.preMovementY);
        let b2 = from.getWorldBounds(from.preMovementX, from.preMovementY);

        let topbot_t = Infinity;
        let bottop_t = Infinity;
        let leftright_t = Infinity;
        let rightleft_t = Infinity;

        if (dy1 !== dy2) {
            topbot_t = (b1.top - b2.bottom) / (dy2 - dy1);
            if (b1.right + dx1*topbot_t <= b2.left + dx2*topbot_t || b1.left + dx1*topbot_t >= b2.right + dx2*topbot_t) {
                topbot_t = Infinity;
            }

            bottop_t = (b1.bottom - b2.top) / (dy2 - dy1);
            if (b1.right + dx1*bottop_t <= b2.left + dx2*bottop_t || b1.left + dx1*bottop_t >= b2.right + dx2*bottop_t) {
                bottop_t = Infinity;
            }
        }
        
        if (dx1 !== dx2) {
            leftright_t = (b1.left - b2.right) / (dx2 - dx1);
            if (b1.bottom + dy1*leftright_t <= b2.top + dy2*leftright_t || b1.top + dy1*leftright_t >= b2.bottom + dy2*leftright_t) {
                leftright_t = Infinity;
            }

            rightleft_t = (b1.right - b2.left) / (dx2 - dx1);
            if (b1.bottom + dy1*rightleft_t <= b2.top + dy2*rightleft_t || b1.top + dy1*rightleft_t >= b2.bottom + dy2*rightleft_t) {
                rightleft_t = Infinity;
            }
        }

        let min_t = Math.min(topbot_t, bottop_t, leftright_t, rightleft_t);

        let direction = {
            [topbot_t]: Physics.Collision.Direction.UP,
            [bottop_t]: Physics.Collision.Direction.DOWN,
            [leftright_t]: Physics.Collision.Direction.LEFT,
            [rightleft_t]: Physics.Collision.Direction.RIGHT,
        }[min_t];

        let result = new Physics.Collision();
        result.move = obj;
        result.from = from;
        result.t = min_t;
        result.direction = direction;

        if (!result.isVertical && !result.isHorizontal) {
            debug('collision was neither vertical nor horizontal:', result);
        }

        return result;
    }

    static collide(obj: PhysicsWorldObject, from: PhysicsWorldObject[], options: Physics.CollideOptions = {}): Pt {
        if (_.isEmpty(from)) return;

        _.defaults(options, {
            transferMomentum: true,
            maxIters: Physics.MAX_ITERS,
        });

        let startX = obj.x;
        let startY = obj.y;

        let collidingWith = from.filter(other => obj !== other && obj.isOverlapping(other));

        let iters = 0;
        while (!_.isEmpty(collidingWith) && iters < options.maxIters) {

            let collisions = collidingWith.map(other => Physics.getCollision(obj, other));
            collisions.sort((a,b) => a.t - b.t);

            for (let collision of collisions) {
                let d = Physics.separate(collision);
                if (d !== 0 && options.transferMomentum) {
                    Physics.transferMomentum(collision);
                }
            }

            collidingWith = collidingWith.filter(other => obj.isOverlapping(other));
            iters++;
        }

        return { x: obj.x - startX, y: obj.y - startY };
    }

    static separate(collision: Physics.Collision, skipSeparation: boolean = false) {
        if (collision.isVertical) {
            return this.separateFromY(collision.move, collision.from, skipSeparation);
        }

        if (collision.isHorizontal) {
            return this.separateFromX(collision.move, collision.from, skipSeparation);
        }

        return 0;
    }

    static separateFromX(obj: PhysicsWorldObject, from: PhysicsWorldObject, skipSeparation: boolean = false) {
        let objBounds = obj.getWorldBounds();
        let fromBounds = from.getWorldBounds();

        if (!G.overlapRectangles(objBounds, fromBounds)) {
            return 0;
        }

        let leftdx = fromBounds.right - objBounds.left;
        let rightdx = fromBounds.left - objBounds.right;
        
        let relativedx = (obj.x - obj.preMovementX) - (from.x - from.preMovementX);

        let dx = 0;

        if (relativedx < 0) {
            dx = leftdx;
        } else if (relativedx > 0) {
            dx = rightdx;
        } else {
            if (Math.abs(rightdx) < Math.abs(leftdx)) {
                dx = rightdx;
            } else {
                dx = leftdx;
            }
        }

        if (!skipSeparation) {
            obj.x += dx;
        }

        return dx;
    }

    static separateFromY(obj: PhysicsWorldObject, from: PhysicsWorldObject, skipSeparation: boolean = false) {
        let objBounds = obj.getWorldBounds();
        let fromBounds = from.getWorldBounds();

        if (!G.overlapRectangles(objBounds, fromBounds)) {
            return 0;
        }

        let updy = fromBounds.bottom - objBounds.top;
        let downdy = fromBounds.top - objBounds.bottom;

        let relativedy = (obj.y - obj.preMovementY) - (from.y - from.preMovementY);

        let dy = 0;

        if (relativedy < 0) {
            dy = updy;
        } else if (relativedy > 0) {
            dy = downdy;
        } else {
            if (Math.abs(downdy) < Math.abs(updy)) {
                dy = downdy;
            } else {
                dy = updy;
            }
        }

        if (!skipSeparation) {
            obj.y += dy;
        }

        return dy;
    }

    static transferMomentum(collision: Physics.Collision) {
        if (collision.isVertical) {
            return this.transferMomentumY(collision.move, collision.from);
        }

        if (collision.isHorizontal) {
            return this.transferMomentumX(collision.move, collision.from);
        }
    }

    private static transferMomentumWithProperty(property: string, obj1: PhysicsWorldObject, obj2: PhysicsWorldObject) {
        let v1i = obj1[property];
        let v2i = obj2[property];

        let m1 = obj1.mass;
        let m2 = obj2.mass;

        if (m1 === 0 && m2 === 0) {
            m1 = 1; m2 = 1;
        }

        let v1f = -v1i;
        if (!obj2.immovable) {
            v1f = 2*m2 / (m1 + m2) * (v2i - v1i) + v1i;
        }
        if (!obj1.immovable) {
            obj1[property] = v1f * obj1.bounce;
        }

        let v2f = -v2i;
        if (!obj1.immovable) {
            v2f = 2*m1 / (m1 + m2) * (v1i - v2i) + v2i;
        }
        if (!obj2.immovable) {
            obj2[property] = v2f * obj2.bounce;
        }
    }

    static transferMomentumX(obj1: PhysicsWorldObject, obj2: PhysicsWorldObject) {
        return this.transferMomentumWithProperty('vx', obj1, obj2);
    }

    static transferMomentumY(obj1: PhysicsWorldObject, obj2: PhysicsWorldObject) {
        return this.transferMomentumWithProperty('vy', obj1, obj2);
    }
}

namespace Physics {
    export const MAX_ITERS = 10;

    export type CollideOptions = {
        transferMomentum?: boolean;
        maxIters?: number;
    }

    export class Collision {
        move: PhysicsWorldObject;
        from: PhysicsWorldObject;
        t: number;
        direction: Collision.Direction;

        get isVertical() {
            return this.direction === Collision.Direction.UP || this.direction === Collision.Direction.DOWN;
        }

        get isHorizontal() {
            return this.direction === Collision.Direction.LEFT || this.direction === Collision.Direction.RIGHT;
        }

        getOther(orig: Physics) {
            return this.move !== orig ? this.move : this.from;
        }
    }

    export namespace Collision {
        export enum Direction {
            LEFT, RIGHT, UP, DOWN
        }
    }
}