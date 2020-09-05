namespace Bounds.Collision {
    export function getDisplacementCollisionCircleCircle(move: CircleBounds, from: CircleBounds) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        let fromPos = from.getCenter();

        let distance = M.distance(movePos.x, movePos.y, fromPos.x, fromPos.y);

        let dx = 0;
        let dy = move.radius + from.radius;
        if (distance !== 0) {
            let dradius = (move.radius + from.radius) - distance;
            debug(dradius)

            dx = (movePos.x - fromPos.x) * dradius / distance;
            dy = (movePos.y - fromPos.y) * dradius / distance;
        }

        return <Bounds.DisplacementCollision>{
            bounds1: move,
            bounds2: from,
            displacementX: dx,
            displacementY: dy,
        };
    }

    export function getDisplacementCollisionCircleRect(move: CircleBounds, from: RectBounds) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        let fromBox = from.getBoundingBox();

        let checkTop = movePos.y <= fromBox.top + fromBox.height/2;
        let checkLeft = movePos.x <= fromBox.left + fromBox.width/2;

        let displacementXs = [];
        let displacementYs = [];

        if (checkTop) {
            displacementXs.push(0);
            displacementYs.push(fromBox.top - move.radius - movePos.y);
        } else {
            displacementXs.push(0);
            displacementYs.push(fromBox.bottom + move.radius - movePos.y);
        }

        if (checkLeft) {
            displacementXs.push(fromBox.left - move.radius - movePos.x);
            displacementYs.push(0);
        } else {
            displacementXs.push(fromBox.right + move.radius - movePos.x);
            displacementYs.push(0);
        }

        if (checkTop && checkLeft) {
            if (movePos.x === fromBox.left && movePos.y === fromBox.top) {
                displacementXs.push(-move.radius * Math.SQRT2);
                displacementYs.push(-move.radius * Math.SQRT2);
            } else if (movePos.x < fromBox.left && movePos.y < fromBox.top) {
                let srcd = M.distance(movePos.x, movePos.y, fromBox.left, fromBox.top);
                let dstd = move.radius - srcd;
                displacementXs.push((movePos.x - fromBox.left) * dstd / srcd);
                displacementYs.push((movePos.y - fromBox.top) * dstd / srcd);
            } else if (movePos.x > fromBox.left && movePos.y > fromBox.top) {
                let srcd = M.distance(movePos.x, movePos.y, fromBox.left, fromBox.top);
                let dstd = move.radius + srcd;
                displacementXs.push((movePos.x - fromBox.left) * dstd / srcd);
                displacementYs.push((movePos.y - fromBox.top) * dstd / srcd);
            }
        } else if (checkTop && !checkLeft) {
            if (movePos.x === fromBox.right && movePos.y === fromBox.top) {
                displacementXs.push(move.radius * Math.SQRT2);
                displacementYs.push(-move.radius * Math.SQRT2);
            } else if (movePos.x > fromBox.right && movePos.y < fromBox.top) {
                let srcd = M.distance(movePos.x, movePos.y, fromBox.right, fromBox.top);
                let dstd = move.radius - srcd;
                displacementXs.push((movePos.x - fromBox.right) * dstd / srcd);
                displacementYs.push((movePos.y - fromBox.top) * dstd / srcd);
            } else if (movePos.x < fromBox.right && movePos.y > fromBox.top) {
                let srcd = M.distance(movePos.x, movePos.y, fromBox.right, fromBox.top);
                let dstd = move.radius + srcd;
                displacementXs.push((movePos.x - fromBox.right) * dstd / srcd);
                displacementYs.push((movePos.y - fromBox.top) * dstd / srcd);
            }
        } else if (!checkTop && !checkLeft) {
            if (movePos.x === fromBox.right && movePos.y === fromBox.bottom) {
                displacementXs.push(move.radius * Math.SQRT2);
                displacementYs.push(move.radius * Math.SQRT2);
            } else if (movePos.x > fromBox.right && movePos.y > fromBox.bottom) {
                let srcd = M.distance(movePos.x, movePos.y, fromBox.right, fromBox.bottom);
                let dstd = move.radius - srcd;
                displacementXs.push((movePos.x - fromBox.right) * dstd / srcd);
                displacementYs.push((movePos.y - fromBox.bottom) * dstd / srcd);
            } else if (movePos.x < fromBox.right && movePos.y < fromBox.bottom) {
                let srcd = M.distance(movePos.x, movePos.y, fromBox.right, fromBox.bottom);
                let dstd = move.radius + srcd;
                displacementXs.push((movePos.x - fromBox.right) * dstd / srcd);
                displacementYs.push((movePos.y - fromBox.bottom) * dstd / srcd);
            }
        } else if (!checkTop && checkLeft) {
            if (movePos.x === fromBox.left && movePos.y === fromBox.bottom) {
                displacementXs.push(-move.radius * Math.SQRT2);
                displacementYs.push(move.radius * Math.SQRT2);
            } else if (movePos.x < fromBox.left && movePos.y > fromBox.bottom) {
                let srcd = M.distance(movePos.x, movePos.y, fromBox.left, fromBox.bottom);
                let dstd = move.radius - srcd;
                displacementXs.push((movePos.x - fromBox.left) * dstd / srcd);
                displacementYs.push((movePos.y - fromBox.bottom) * dstd / srcd);
            } else if (movePos.x > fromBox.left && movePos.y < fromBox.bottom) {
                let srcd = M.distance(movePos.x, movePos.y, fromBox.left, fromBox.bottom);
                let dstd = move.radius + srcd;
                displacementXs.push((movePos.x - fromBox.left) * dstd / srcd);
                displacementYs.push((movePos.y - fromBox.bottom) * dstd / srcd);
            }
        }

        let i = M.argmin(A.range(displacementXs.length), i => M.magnitude(displacementXs[i], displacementYs[i]));

        return <Bounds.DisplacementCollision>{
            bounds1: move,
            bounds2: from,
            displacementX: displacementXs[i],
            displacementY: displacementYs[i],
        };
    }

    export function getDisplacementCollisionRectCircle(move: RectBounds, from: CircleBounds) {
        return invertDisplacementCollision(getDisplacementCollisionCircleRect(from, move));
    }

    export function getDisplacementCollisionRectRect(move: RectBounds, from: RectBounds) {
        if (!move.isOverlapping(from)) return undefined;

        let currentBox = move.getBoundingBox();
        let currentOtherBox = from.getBoundingBox();

        let displacementX = M.argmin([currentOtherBox.right - currentBox.left, currentOtherBox.left - currentBox.right], Math.abs);
        let displacementY = M.argmin([currentOtherBox.bottom - currentBox.top, currentOtherBox.top - currentBox.bottom], Math.abs);

        if (Math.abs(displacementX) < Math.abs(displacementY)) {
            displacementY = 0;
        } else {
            displacementX = 0;
        }

        return {
            bounds1: move,
            bounds2: from,
            displacementX,
            displacementY,
        };
    }

    export function getRaycastCollisionCircleCircle(move: CircleBounds, movedx: number, movedy: number, from: CircleBounds, fromdx: number, fromdy: number) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        movePos.x -= movedx;
        movePos.y -= movedy;
        let fromPos = from.getCenter();
        fromPos.x -= fromdx;
        fromPos.y -= fromdy;

        let t = raycastTimeCircleCircle(movePos.x - fromPos.x, movePos.y - fromPos.y, movedx - fromdx, movedy - fromdy, move.radius + from.radius);

        let result = <Bounds.RaycastCollision>getDisplacementCollisionCircleCircle(move, from);
        result.t = t;

        return result;
    }

    export function getRaycastCollisionCircleRect(move: CircleBounds, movedx: number, movedy: number, from: RectBounds, fromdx: number, fromdy: number) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        let fromBox = from.getBoundingBox();

        let topleft_t = raycastTimeCircleCircle(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius);
        let topright_t = raycastTimeCircleCircle(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius);
        let bottomright_t = raycastTimeCircleCircle(movePos.x - fromBox.right, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius);
        let bottomleft_t = raycastTimeCircleCircle(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius);

        let left_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
        let right_t = raycastTimeCircleSegment(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
        let top_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
        let bottom_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);

        let t = Math.min(topleft_t, topright_t, bottomright_t, bottomleft_t, left_t, right_t, top_t, bottom_t);

        let result = <Bounds.RaycastCollision>getDisplacementCollisionCircleRect(move, from);
        result.t = t;

        return result;
    }

    export function getRaycastCollisionRectCircle(move: RectBounds, movedx: number, movedy: number, from: CircleBounds, fromdx: number, fromdy: number) {
        return invertRaycastCollision(getRaycastCollisionCircleRect(from, fromdx, fromdy, move, movedx, movedy));
    }

    export function getRaycastCollisionRectRect(move: RectBounds, movedx: number, movedy: number, from: RectBounds, fromdx: number, fromdy: number) {
        if (!move.isOverlapping(from)) return undefined;
    
        let box = move.getBoundingBox();
        box.x -= movedx;
        box.y -= movedy;
        let otherbox = from.getBoundingBox();
        otherbox.x -= fromdx;
        otherbox.y -= fromdy;

        let topbot_t = Infinity;
        let bottop_t = Infinity;
        let leftright_t = Infinity;
        let rightleft_t = Infinity;

        if (movedy !== fromdy) {
            topbot_t = (box.top - otherbox.bottom) / (fromdy - movedy);
            if (box.right + movedx*topbot_t <= otherbox.left + fromdx*topbot_t || box.left + movedx*topbot_t >= otherbox.right + fromdx*topbot_t) {
                topbot_t = Infinity;
            }

            bottop_t = (box.bottom - otherbox.top) / (fromdy - movedy);
            if (box.right + movedx*bottop_t <= otherbox.left + fromdx*bottop_t || box.left + movedx*bottop_t >= otherbox.right + fromdx*bottop_t) {
                bottop_t = Infinity;
            }
        }
        
        if (movedx !== fromdx) {
            leftright_t = (box.left - otherbox.right) / (fromdx - movedx);
            if (box.bottom + movedy*leftright_t <= otherbox.top + fromdy*leftright_t || box.top + movedy*leftright_t >= otherbox.bottom + fromdy*leftright_t) {
                leftright_t = Infinity;
            }

            rightleft_t = (box.right - otherbox.left) / (fromdx - movedx);
            if (box.bottom + movedy*rightleft_t <= otherbox.top + fromdy*rightleft_t || box.top + movedy*rightleft_t >= otherbox.bottom + fromdy*rightleft_t) {
                rightleft_t = Infinity;
            }
        }

        let min_t = Math.min(topbot_t, bottop_t, leftright_t, rightleft_t);

        if (min_t === Infinity) return undefined;

        let displacementX = 0;
        let displacementY = 0;

        let currentBox = move.getBoundingBox();
        let currentOtherBox = from.getBoundingBox();

        if (min_t === topbot_t) {
            displacementY = currentOtherBox.bottom - currentBox.top;
        } else if (min_t === bottop_t) {
            displacementY = currentOtherBox.top - currentBox.bottom;
        } else if (min_t === leftright_t) {
            displacementX = currentOtherBox.right - currentBox.left;
        } else if (min_t === rightleft_t) {
            displacementX = currentOtherBox.left - currentBox.right;
        }

        if (displacementX !== 0 && displacementY !== 0) {
            error("Warning: rect displacement in both axes");
        }

        return {
            bounds1: move,
            bounds2: from,
            t: min_t,
            displacementX,
            displacementY,
        };
    }

    export function isOverlappingCircleCircle(move: CircleBounds, from: CircleBounds) {
        let movePosition = move.getCenter();
        let fromPosition = from.getCenter();
        return M.distance(movePosition.x, movePosition.y, fromPosition.x, fromPosition.y) < move.radius + from.radius;
    }

    export function isOverlappingCircleRect(move: CircleBounds, from: RectBounds) {
        let movePosition = move.getCenter();
        let fromBox = from.getBoundingBox();

        // Tall rect
        if (fromBox.left < movePosition.x && movePosition.x < fromBox.right && fromBox.top - move.radius < movePosition.y && movePosition.y < fromBox.bottom + move.radius) {
            return true;
        }

        // Long rect
        if (fromBox.left - move.radius < movePosition.x && movePosition.x < fromBox.right + move.radius && fromBox.top < movePosition.y && movePosition.y < fromBox.bottom) {
            return true;
        }

        // Vertices
        if (M.distanceSq(movePosition.x, movePosition.y, fromBox.left, fromBox.top) < move.radius*move.radius) {
            return true;
        }

        if (M.distanceSq(movePosition.x, movePosition.y, fromBox.left, fromBox.bottom) < move.radius*move.radius) {
            return true;
        }

        if (M.distanceSq(movePosition.x, movePosition.y, fromBox.right, fromBox.bottom) < move.radius*move.radius) {
            return true;
        }

        if (M.distanceSq(movePosition.x, movePosition.y, fromBox.right, fromBox.top) < move.radius*move.radius) {
            return true;
        }

        return false;
    }

    export function isOverlappingRectRect(move: RectBounds, from: RectBounds) {
        return G.overlapRectangles(move.getBoundingBox(), from.getBoundingBox());
    }

    export function invertDisplacementCollision(collision: Bounds.DisplacementCollision) {
        if (collision) {
            let temp = collision.bounds1;
            collision.bounds1 = collision.bounds2;
            collision.bounds2 = temp;

            collision.displacementX *= -1;
            collision.displacementY *= -1;
        }
        return collision;
    }

    export function invertRaycastCollision(collision: Bounds.RaycastCollision) {
        if (collision) {
            let temp = collision.bounds1;
            collision.bounds1 = collision.bounds2;
            collision.bounds2 = temp;

            collision.displacementX *= -1;
            collision.displacementY *= -1;
        }
        return collision;
    }

    function raycastTimeCircleCircle(dx: number, dy: number, ddx: number, ddy: number, R: number) {
        let a = ddx*ddx + ddy*ddy;
        let b = 2*dx*ddx + 2*dy*ddy;
        let c = dx*dx + dy*dy - R*R;

        let disc = b*b - 4*a*c;
        if (disc < 0) return Infinity;

        return (-b - Math.sqrt(disc)) / (2*a);
    }

    function raycastTimeCircleSegment(dx: number, dy: number, ddx: number, ddy: number, r: number, linedx: number, linedy: number) {
        let L = M.magnitude(linedx, linedy);
        let denom = linedx*ddy - linedy*ddx;
        let t1 = (r*L + linedy*dx - linedx*dy) / denom;
        let t2 = (-r*L + linedy*dx - linedx*dy) / denom;
        let t = Math.min(t1, t2);

        let newx = dx + ddx*t;
        let newy = dy + ddy*t;
        let comp = linedx*newx + linedy*newy;

        if (comp < 0 || L*L < comp) return Infinity;

        return t;
    }
}