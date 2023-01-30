namespace Bounds.Collision {
    const OVERLAP_EPSILON: number = 0.000001;

    export function getDisplacementCollisionCircleCircle(move: CircleBounds, from: CircleBounds) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        let fromPos = from.getCenter();

        let distance = M.distance(movePos.x, movePos.y, fromPos.x, fromPos.y);

        let dx = 0;
        let dy = move.radius + from.radius;
        if (distance !== 0) {
            let dradius = (move.radius + from.radius) - distance;

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

        if (displacementXs.length === 0) return undefined;

        let i = M.argmin(A.range(displacementXs.length), i => M.magnitude(displacementXs[i], displacementYs[i]));

        return <Bounds.DisplacementCollision>{
            bounds1: move,
            bounds2: from,
            displacementX: displacementXs[i],
            displacementY: displacementYs[i],
        };
    }

    export function getDisplacementCollisionCircleSlope(move: CircleBounds, from: SlopeBounds) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        let fromBox = from.getBoundingBox();

        let newXs = [];
        let newYs = [];


        // Right edge
        if (from.direction !== 'upright' && from.direction !== 'downright') {
            let t = closestPointOnLine_t(movePos.x, movePos.y, fromBox.right + move.radius, fromBox.top, fromBox.right + move.radius, fromBox.bottom);
            if (0 <= t && t <= 1) {
                newXs.push(fromBox.right + move.radius);
                newYs.push(fromBox.top * (1-t) + fromBox.bottom * t);
            }
        }

        // Left edge
        if (from.direction !== 'upleft' && from.direction !== 'downleft') {
            let t = closestPointOnLine_t(movePos.x, movePos.y, fromBox.left - move.radius, fromBox.top, fromBox.left - move.radius, fromBox.bottom);
            if (0 <= t && t <= 1) {
                newXs.push(fromBox.left - move.radius);
                newYs.push(fromBox.top * (1-t) + fromBox.bottom * t);
            }
        }

        // Top edge
        if (from.direction !== 'upleft' && from.direction !== 'upright') {
            let t = closestPointOnLine_t(movePos.x, movePos.y, fromBox.left, fromBox.top - move.radius, fromBox.right, fromBox.top - move.radius);
            if (0 <= t && t <= 1) {
                newXs.push(fromBox.left * (1-t) + fromBox.right * t);
                newYs.push(fromBox.top - move.radius);
            }
        }

        // Bottom edge
        if (from.direction !== 'downleft' && from.direction !== 'downright') {
            let t = closestPointOnLine_t(movePos.x, movePos.y, fromBox.left, fromBox.bottom + move.radius, fromBox.right, fromBox.bottom + move.radius);
            if (0 <= t && t <= 1) {
                newXs.push(fromBox.left * (1-t) + fromBox.right * t);
                newYs.push(fromBox.bottom + move.radius);
            }
        }

        // Diagonal edges
        let dfactor = move.radius / M.magnitude(fromBox.width, fromBox.height);
        let rx = fromBox.height * dfactor;
        let ry = fromBox.width * dfactor;

        let lx1: number, ly1: number, lx2: number, ly2: number;
        
        if (from.direction === 'upleft') {
            lx1 = fromBox.left - rx;
            ly1 = fromBox.bottom - ry;
            lx2 = fromBox.right - rx;
            ly2 = fromBox.top - ry;
        } else if (from.direction === 'upright') {
            lx1 = fromBox.left + rx;
            ly1 = fromBox.top - ry;
            lx2 = fromBox.right + rx;
            ly2 = fromBox.bottom - ry;
        } else if (from.direction === 'downleft') {
            lx1 = fromBox.left - rx;
            ly1 = fromBox.top + ry;
            lx2 = fromBox.right - rx;
            ly2 = fromBox.bottom + ry;
        } else {
            lx1 = fromBox.left + rx;
            ly1 = fromBox.bottom + ry;
            lx2 = fromBox.right + rx;
            ly2 = fromBox.top + ry;
        }

        let t = closestPointOnLine_t(movePos.x, movePos.y, lx1, ly1, lx2, ly2);
        if (0 <= t && t <= 1) {
            newXs.push(lx1 * (1-t) + lx2 * t);
            newYs.push(ly1 * (1-t) + ly2 * t);
        }

        // Vertices
        function addVertexPos(vx: number, vy: number, ldx1: number, ldy1: number, ldx2: number, ldy2: number) {
            let angle = closestPointOnCircle_angle(movePos.x, movePos.y, vx, vy);
            let newX = vx + M.cos(angle) * move.radius;
            let newY = vy + M.sin(angle) * move.radius;
            
            if (vectorBetweenVectors(newX - vx, newY - vy, ldx1, ldy1, ldx2, ldy2)) {
                newXs.push(newX);
                newYs.push(newY);
            }
        }

        if (from.direction === 'upleft') {
            addVertexPos(fromBox.right, fromBox.bottom, 1, 0, 0, 1);
            addVertexPos(fromBox.right, fromBox.top, 1, 0, -fromBox.height, -fromBox.width);
            addVertexPos(fromBox.left, fromBox.bottom, 0, 1, -fromBox.height, -fromBox.width);
        } else if (from.direction === 'upright') {
            addVertexPos(fromBox.left, fromBox.bottom, -1, 0, 0, 1);
            addVertexPos(fromBox.left, fromBox.top, -1, 0, fromBox.height, -fromBox.width);
            addVertexPos(fromBox.right, fromBox.bottom, 0, 1, fromBox.height, -fromBox.width);
        } else if (from.direction === 'downright') {
            addVertexPos(fromBox.left, fromBox.top, -1, 0, 0, -1);
            addVertexPos(fromBox.left, fromBox.bottom, -1, 0, fromBox.height, fromBox.width);
            addVertexPos(fromBox.right, fromBox.top, 0, -1, fromBox.height, fromBox.width);
        } else {
            addVertexPos(fromBox.right, fromBox.top, 1, 0, 0, -1);
            addVertexPos(fromBox.right, fromBox.bottom, 1, 0, -fromBox.height, fromBox.width);
            addVertexPos(fromBox.left, fromBox.top, 0, -1, -fromBox.height, fromBox.width);
        }

        if (newXs.length === 0) return undefined;

        let i = M.argmin(A.range(newXs.length), i => M.distanceSq(movePos.x, movePos.y, newXs[i], newYs[i]));

        let displacementX = newXs[i] - movePos.x;
        let displacementY = newYs[i] - movePos.y;

        return <Bounds.DisplacementCollision>{
            bounds1: move,
            bounds2: from,
            displacementX,
            displacementY,
        };
    }

    export function getDisplacementCollisionCircleInvertedRect(move: CircleBounds, from: InvertedRectBounds) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        let fromBox = from.getInnerBox();

        let displacementX = 0;
        if (movePos.x - move.radius < fromBox.left) displacementX = fromBox.left - (movePos.x - move.radius);
        if (movePos.x + move.radius > fromBox.right) displacementX = fromBox.right - (movePos.x + move.radius);

        let displacementY = 0;
        if (movePos.y - move.radius < fromBox.top) displacementY = fromBox.top - (movePos.y - move.radius);
        if (movePos.y + move.radius > fromBox.bottom) displacementY = fromBox.bottom - (movePos.y + move.radius);

        return <Bounds.DisplacementCollision>{
            bounds1: move,
            bounds2: from,
            displacementX: displacementX,
            displacementY: displacementY,
        };
    }

    export function getDisplacementCollisionCircleInvertedCircle(move: CircleBounds, from: InvertedCircleBounds) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        let fromPos = from.getCenter();

        let distance = M.distance(movePos.x, movePos.y, fromPos.x, fromPos.y);

        let dx = 0;
        let dy = from.radius - move.radius;
        if (distance !== 0) {
            let dradius = (from.radius - move.radius) - distance;

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

    export function getDisplacementCollisionRectSlope(move: RectBounds, from: SlopeBounds) {
        if (!move.isOverlapping(from)) return undefined;

        let moveBox = move.getBoundingBox();
        let fromBox = from.getBoundingBox();

        let newXs = [];
        let newYs = [];

        // Left Edge + vertex
        if (from.direction === 'upright' || from.direction === 'downright'
            || (from.direction === 'upleft' && moveBox.top < fromBox.bottom && fromBox.bottom < moveBox.bottom)
            || (from.direction === 'downleft' && moveBox.top < fromBox.top && fromBox.top < moveBox.bottom)) {
            newXs.push(fromBox.left - moveBox.width);
            newYs.push(moveBox.top);
        }

        // Right Edge + vertex
        if (from.direction === 'upleft' || from.direction === 'downleft'
            || (from.direction === 'upright' && moveBox.top < fromBox.bottom && fromBox.bottom < moveBox.bottom)
            || (from.direction === 'downright' && moveBox.top < fromBox.top && fromBox.top < moveBox.bottom)) {
            newXs.push(fromBox.right);
            newYs.push(moveBox.top);
        }

        // Top Edge + vertex
        if (from.direction === 'downleft' || from.direction === 'downright'
            || (from.direction === 'upleft' && moveBox.left < fromBox.right && fromBox.right < moveBox.right)
            || (from.direction === 'upright' && moveBox.left < fromBox.left && fromBox.left < moveBox.right)) {
            newXs.push(moveBox.left);
            newYs.push(fromBox.top - moveBox.height);
        }

        // Bottom Edge + vertex
        if (from.direction === 'upleft' || from.direction === 'upright'
            || (from.direction === 'downleft' && moveBox.left < fromBox.right && fromBox.right < moveBox.right)
            || (from.direction === 'downright' && moveBox.left < fromBox.left && fromBox.left < moveBox.right)) {
            newXs.push(moveBox.left);
            newYs.push(fromBox.bottom);
        }

        let ww = fromBox.width*fromBox.width;
        let hh = fromBox.height*fromBox.height;
        let wh = fromBox.width*fromBox.height;

        // Up-left edge
        if (from.direction === 'upleft') {
            let xi = (ww*moveBox.right + hh*fromBox.left + wh*fromBox.bottom - wh*moveBox.bottom) / (ww + hh);
            let yi = fromBox.width/fromBox.height * (xi - moveBox.right) + moveBox.bottom;
            newXs.push(xi - moveBox.width);
            newYs.push(yi - moveBox.height);
        }
        
        // Up-right edge
        if (from.direction === 'upright') {
            let xi = (ww*moveBox.left + hh*fromBox.left - wh*fromBox.top + wh*moveBox.bottom) / (ww + hh);
            let yi = -fromBox.width/fromBox.height * (xi - moveBox.left) + moveBox.bottom;
            newXs.push(xi);
            newYs.push(yi - moveBox.height);
        }

        // Down-right edge
        if (from.direction === 'downright') {
            let xi = (ww*moveBox.left + hh*fromBox.left + wh*fromBox.bottom - wh*moveBox.top) / (ww + hh);
            let yi = fromBox.width/fromBox.height * (xi - moveBox.left) + moveBox.top;
            newXs.push(xi);
            newYs.push(yi);
        }

        // Down-left edge
        if (from.direction === 'downleft') {
            let xi = (ww*moveBox.right + hh*fromBox.left - wh*fromBox.top + wh*moveBox.top) / (ww + hh);
            let yi = -fromBox.width/fromBox.height * (xi - moveBox.right) + moveBox.top;
            newXs.push(xi - moveBox.width);
            newYs.push(yi);
        }

        if (newXs.length === 0) return undefined;

        let i = M.argmin(A.range(newXs.length), i => M.distanceSq(moveBox.left, moveBox.top, newXs[i], newYs[i]));

        let displacementX = newXs[i] - moveBox.left;
        let displacementY = newYs[i] - moveBox.top;

        return <Bounds.DisplacementCollision>{
            bounds1: move,
            bounds2: from,
            displacementX,
            displacementY,
        };
    }

    export function getDisplacementCollisionRectInvertedRect(move: RectBounds, from: InvertedRectBounds) {
        if (!move.isOverlapping(from)) return undefined;

        let moveBox = move.getBoundingBox();
        let fromBox = from.getInnerBox();

        let displacementX = 0;
        if (moveBox.left < fromBox.left) displacementX = fromBox.left - moveBox.left;
        if (moveBox.right > fromBox.right) displacementX = fromBox.right - moveBox.right;

        let displacementY = 0;
        if (moveBox.top < fromBox.top) displacementY = fromBox.top - moveBox.top;
        if (moveBox.bottom > fromBox.bottom) displacementY = fromBox.bottom - moveBox.bottom;

        return <Bounds.DisplacementCollision>{
            bounds1: move,
            bounds2: from,
            displacementX: displacementX,
            displacementY: displacementY,
        };
    }

    export function getDisplacementCollisionRectInvertedCircle(move: RectBounds, from: InvertedCircleBounds) {
        if (!move.isOverlapping(from)) return undefined;

        let moveBox = move.getBoundingBox();
        let fromPos = from.getCenter();

        let dx = moveBox.x + moveBox.width/2 - fromPos.x;
        let dy = moveBox.y + moveBox.height/2 - fromPos.y;

        let displacementX: number;
        let displacementY: number;

        if (dx === 0 && dy === 0) {
            displacementX = 0;
            displacementY = dy - from.radius;
        } else if (dx === 0) {
            displacementX = 0;
            displacementY = dy + Math.sign(dy) * (Math.sqrt(from.radius**2 - (move.width/2)**2) - move.height/2);
        } else if (dy === 0) {
            displacementX = dx + Math.sign(dx) * (Math.sqrt(from.radius**2 - (move.height/2)**2) - move.width/2);
            displacementY = 0;
        } else {
            let cornerx = moveBox.x + (dx < 0 ? 0 : moveBox.width);
            let cornery = moveBox.y + (dy < 0 ? 0 : moveBox.height);

            let cornerdx = cornerx - fromPos.x;
            let cornerdy = cornery - fromPos.y;

            let distance = M.distance(cornerdx, cornerdy, fromPos.x, fromPos.y);

            displacementX = cornerdx * from.radius / distance;
            displacementY = cornerdy * from.radius / distance;
        }

        return <Bounds.DisplacementCollision>{
            bounds1: move,
            bounds2: from,
            displacementX: displacementX,
            displacementY: displacementY,
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

        movePos.x += movedx;
        movePos.y += movedy;
        fromPos.x += fromdx;
        fromPos.y += fromdy;

        let result = <Bounds.RaycastCollision>getDisplacementCollisionCircleCircle(move, from);
        result.t = t;

        return result;
    }

    export function getRaycastCollisionCircleRect(move: CircleBounds, movedx: number, movedy: number, from: RectBounds, fromdx: number, fromdy: number) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        movePos.x -= movedx;
        movePos.y -= movedy;
        let fromBox = from.getBoundingBox();
        fromBox.x -= fromdx;
        fromBox.y -= fromdy;

        let topleft_t = raycastTimeCircleCircle(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius);
        let topright_t = raycastTimeCircleCircle(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius);
        let bottomright_t = raycastTimeCircleCircle(movePos.x - fromBox.right, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius);
        let bottomleft_t = raycastTimeCircleCircle(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius);

        let left_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
        let right_t = raycastTimeCircleSegment(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
        let top_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
        let bottom_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);

        let t = Math.min(topleft_t, topright_t, bottomright_t, bottomleft_t, left_t, right_t, top_t, bottom_t);

        movePos.x += movedx;
        movePos.y += movedy;
        fromBox.x += fromdx;
        fromBox.y += fromdy;

        let result = <Bounds.RaycastCollision>getDisplacementCollisionCircleRect(move, from);
        result.t = t;

        return result;
    }

    export function getRaycastCollisionCircleSlope(move: CircleBounds, movedx: number, movedy: number, from: SlopeBounds, fromdx: number, fromdy: number) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        movePos.x -= movedx;
        movePos.y -= movedy;
        let fromBox = from.getBoundingBox();
        fromBox.x -= fromdx;
        fromBox.y -= fromdy;

        let topleft_t = from.direction === 'upleft' ? Infinity : raycastTimeCircleCircle(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius);
        let topright_t = from.direction === 'upright' ? Infinity : raycastTimeCircleCircle(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius);
        let bottomright_t = from.direction === 'downright' ? Infinity : raycastTimeCircleCircle(movePos.x - fromBox.right, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius);
        let bottomleft_t = from.direction === 'downleft' ? Infinity : raycastTimeCircleCircle(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius);


        let line1_t: number, line2_t: number, line3_t: number;

        if (from.direction === 'upleft') {
            line1_t = raycastTimeCircleSegment(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
            line2_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
            line3_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, -fromBox.height);
        } else if (from.direction === 'upright') {
            line1_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
            line2_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
            line3_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, fromBox.height);
        } else if (from.direction === 'downright') {
            line1_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
            line2_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
            line3_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.bottom, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, -fromBox.height);
        } else {
            line1_t = raycastTimeCircleSegment(movePos.x - fromBox.right, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, 0, fromBox.height);
            line2_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, 0);
            line3_t = raycastTimeCircleSegment(movePos.x - fromBox.left, movePos.y - fromBox.top, movedx - fromdx, movedy - fromdy, move.radius, fromBox.width, fromBox.height);
        }

        let t = Math.min(topleft_t, topright_t, bottomright_t, bottomleft_t, line1_t, line2_t, line3_t);

        movePos.x += movedx;
        movePos.y += movedy;
        fromBox.x += fromdx;
        fromBox.y += fromdy;

        let result = <Bounds.RaycastCollision>getDisplacementCollisionCircleSlope(move, from);
        result.t = t;

        return result;
    }

    export function getRaycastCollisionCircleInvertedRect(move: CircleBounds, movedx: number, movedy: number, from: InvertedRectBounds, fromdx: number, fromdy: number) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        movePos.x -= movedx;
        movePos.y -= movedy;
        let fromBox = from.getInnerBox();
        fromBox.x -= fromdx;
        fromBox.y -= fromdy;

        let left_t = movePos.x - move.radius + movedx < fromBox.left ? (movePos.x - move.radius - fromBox.left) / (fromdx - movedx) : Infinity;
        let right_t = movePos.x + move.radius + movedx > fromBox.right ? (movePos.x + move.radius - fromBox.right) / (fromdx - movedx) : Infinity;
        let top_t = movePos.y - move.radius + movedy < fromBox.top ? (movePos.y - move.radius - fromBox.top) / (fromdy - movedy) : Infinity;
        let bottom_t = movePos.y + move.radius + movedy > fromBox.bottom ? (movePos.y + move.radius - fromBox.bottom) / (fromdy - movedy) : Infinity;

        let t = Math.min(left_t, right_t, top_t, bottom_t);

        movePos.x += movedx;
        movePos.y += movedy;
        fromBox.x += fromdx;
        fromBox.y += fromdy;

        if (!isFinite(t) && fromdx === movedx && fromdy === movedy) {
            t = 0;
        }

        if (!isFinite(t)) {
            console.error(`Failed to detect time of collision between circle and inverted rect:`, move.parent, { x: movePos.x, y: movePos.y, radius: move.radius }, movedx, movedy, from.parent, fromBox, fromdx, fromdy);
        }

        let result = <Bounds.RaycastCollision>getDisplacementCollisionCircleInvertedRect(move, from);
        result.t = t;

        return result;
    }

    export function getRaycastCollisionCircleInvertedCircle(move: CircleBounds, movedx: number, movedy: number, from: InvertedCircleBounds, fromdx: number, fromdy: number) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        movePos.x -= movedx;
        movePos.y -= movedy;
        let fromPos = from.getCenter();
        fromPos.x -= fromdx;
        fromPos.y -= fromdy;

        let t = raycastTimeCircleInvertedCircle(movePos.x - fromPos.x, movePos.y - fromPos.y, movedx - fromdx, movedy - fromdy, move.radius + from.radius);

        movePos.x += movedx;
        movePos.y += movedy;
        fromPos.x += fromdx;
        fromPos.y += fromdy;

        let result = <Bounds.RaycastCollision>getDisplacementCollisionCircleInvertedCircle(move, from);
        result.t = t;

        return result;
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

        box.x += movedx;
        box.y += movedy;
        otherbox.x += fromdx;
        otherbox.y += fromdy;

        if (min_t === Infinity) return undefined;

        let displacementX = 0;
        let displacementY = 0;

        if (min_t === topbot_t) {
            displacementY = otherbox.bottom - box.top;
        } else if (min_t === bottop_t) {
            displacementY = otherbox.top - box.bottom;
        } else if (min_t === leftright_t) {
            displacementX = otherbox.right - box.left;
        } else if (min_t === rightleft_t) {
            displacementX = otherbox.left - box.right;
        }

        if (displacementX !== 0 && displacementY !== 0) {
            console.error("Warning: rect displacement in both axes");
        }

        return {
            bounds1: move,
            bounds2: from,
            t: min_t,
            displacementX,
            displacementY,
        };
    }

    export function getRaycastCollisionRectSlope(move: RectBounds, movedx: number, movedy: number, from: SlopeBounds, fromdx: number, fromdy: number) {
        if (!move.isOverlapping(from)) return undefined;

        let moveBox = move.getBoundingBox();
        moveBox.x -= movedx;
        moveBox.y -= movedy;
        let fromBox = from.getBoundingBox();
        fromBox.x -= fromdx;
        fromBox.y -= fromdy;

        let left_t = Infinity;
        let right_t = Infinity;
        let top_t = Infinity;
        let bottom_t = Infinity;

        if (movedx !== fromdx) {
            left_t = (fromBox.left - moveBox.right) / (movedx - fromdx);
            if (moveBox.top + movedy*left_t >= fromBox.bottom + fromdy*left_t || fromBox.top + fromdy*left_t >= moveBox.bottom + movedy*left_t) left_t = Infinity;
            if (from.direction === 'upleft' && (moveBox.top + movedy*left_t >= fromBox.bottom + fromdy*left_t || fromBox.bottom + fromdy*left_t >= moveBox.bottom + movedy*left_t)) left_t = Infinity;
            if (from.direction === 'downleft' && (moveBox.top + movedy*left_t >= fromBox.top + fromdy*left_t || fromBox.top + fromdy*left_t >= moveBox.bottom + movedy*left_t)) left_t = Infinity;

            right_t = (fromBox.right - moveBox.left) / (movedx - fromdx);
            if (moveBox.top + movedy*right_t >= fromBox.bottom + fromdy*right_t || fromBox.top + fromdy*right_t >= moveBox.bottom + movedy*right_t) right_t = Infinity;
            if (from.direction === 'upright' && (moveBox.top + movedy*right_t >= fromBox.bottom + fromdy*right_t || fromBox.bottom + fromdy*right_t >= moveBox.bottom + movedy*right_t)) right_t = Infinity;
            if (from.direction === 'downright' && (moveBox.top + movedy*right_t >= fromBox.top + fromdy*right_t || fromBox.top + fromdy*right_t >= moveBox.bottom + movedy*right_t)) right_t = Infinity;
        }

        if (movedy !== fromdy) {
            top_t = (fromBox.top - moveBox.bottom) / (movedy - fromdy);
            if (moveBox.left + movedx*top_t >= fromBox.right + fromdx*top_t || fromBox.left + fromdx*top_t >= moveBox.right + movedx*top_t) top_t = Infinity;
            if (from.direction === 'upleft' && (moveBox.left + movedx*top_t >= fromBox.right + fromdx*top_t || fromBox.right + fromdx*top_t >= moveBox.right + movedx*top_t)) top_t = Infinity;
            if (from.direction === 'upright' && (moveBox.left + movedx*top_t >= fromBox.left + fromdx*top_t || fromBox.left + fromdx*top_t >= moveBox.right + movedx*top_t)) top_t = Infinity;

            bottom_t = (fromBox.bottom - moveBox.top) / (movedy - fromdy);
            if (moveBox.left + movedx*bottom_t >= fromBox.right + fromdx*bottom_t || fromBox.left + fromdx*bottom_t >= moveBox.right + movedx*bottom_t) bottom_t = Infinity;
            if (from.direction === 'downleft' && (moveBox.left + movedx*bottom_t >= fromBox.right + fromdx*bottom_t || fromBox.right + fromdx*bottom_t >= moveBox.right + movedx*bottom_t)) bottom_t = Infinity;
            if (from.direction === 'downright' && (moveBox.left + movedx*bottom_t >= fromBox.left + fromdx*bottom_t || fromBox.left + fromdx*bottom_t >= moveBox.right + movedx*bottom_t)) bottom_t = Infinity;
        }

        let topleft_t = from.direction !== 'upleft' ? Infinity : raycastTimePointSegment(moveBox.right-fromBox.left, moveBox.bottom-fromBox.bottom, movedx-fromdx, movedy-fromdy, fromBox.width, -fromBox.height);
        let topright_t = from.direction !== 'upright' ? Infinity : raycastTimePointSegment(moveBox.left-fromBox.left, moveBox.bottom-fromBox.top, movedx-fromdx, movedy-fromdy, fromBox.width, fromBox.height);
        let bottomleft_t = from.direction !== 'downleft' ? Infinity : raycastTimePointSegment(moveBox.right-fromBox.left, moveBox.top-fromBox.top, movedx-fromdx, movedy-fromdy, fromBox.width, fromBox.height);
        let bottomright_t = from.direction !== 'downright' ? Infinity : raycastTimePointSegment(moveBox.left-fromBox.left, moveBox.top-fromBox.bottom, movedx-fromdx, movedy-fromdy, fromBox.width, -fromBox.height);

        moveBox.x += movedx;
        moveBox.y += movedy;
        fromBox.x += fromdx;
        fromBox.y += fromdy;

        let t = Math.min(left_t, right_t, top_t, bottom_t, topleft_t, topright_t, bottomleft_t, bottomright_t);
        if (!isFinite(t)) return undefined;

        let ww = fromBox.width*fromBox.width;
        let hh = fromBox.height*fromBox.height;
        let wh = fromBox.width*fromBox.height;

        let newX: number, newY: number;

        if (t === left_t) {
            newX = fromBox.left - moveBox.width;
            newY = moveBox.top;
        } else if (t === right_t) {
            newX = fromBox.right;
            newY = moveBox.top;
        } else if (t === top_t) {
            newX = moveBox.left;
            newY = fromBox.top - moveBox.height;
        } else if (t === bottom_t) {
            newX = moveBox.left;
            newY = fromBox.bottom;
        } else if (t === topleft_t) {
            let xi = (ww*moveBox.right + hh*fromBox.left + wh*fromBox.bottom - wh*moveBox.bottom) / (ww + hh);
            let yi = fromBox.width/fromBox.height * (xi - moveBox.right) + moveBox.bottom;
            newX = xi - moveBox.width;
            newY = yi - moveBox.height;
        } else if (t === topright_t) {
            let xi = (ww*moveBox.left + hh*fromBox.left - wh*fromBox.top + wh*moveBox.bottom) / (ww + hh);
            let yi = -fromBox.width/fromBox.height * (xi - moveBox.left) + moveBox.bottom;
            newX = xi;
            newY = yi - moveBox.height;
        } else if (t === bottomright_t) {
            let xi = (ww*moveBox.left + hh*fromBox.left + wh*fromBox.bottom - wh*moveBox.top) / (ww + hh);
            let yi = fromBox.width/fromBox.height * (xi - moveBox.left) + moveBox.top;
            newX = xi;
            newY = yi;
        } else {
            let xi = (ww*moveBox.right + hh*fromBox.left - wh*fromBox.top + wh*moveBox.top) / (ww + hh);
            let yi = -fromBox.width/fromBox.height * (xi - moveBox.right) + moveBox.top;
            newX = xi - moveBox.width;
            newY = yi;
        }

        return <Bounds.RaycastCollision>{
            bounds1: move,
            bounds2: from,
            t: t,
            displacementX: newX - moveBox.left,
            displacementY: newY - moveBox.top
        };
    }

    export function getRaycastCollisionRectInvertedRect(move: RectBounds, movedx: number, movedy: number, from: InvertedRectBounds, fromdx: number, fromdy: number) {
        if (!move.isOverlapping(from)) return undefined;

        let moveBox = move.getBoundingBox();
        moveBox.x -= movedx;
        moveBox.y -= movedy;
        let fromBox = from.getInnerBox();
        fromBox.x -= fromdx;
        fromBox.y -= fromdy;

        let left_t = moveBox.left + movedx < fromBox.left ? (moveBox.left - fromBox.left) / (fromdx - movedx) : Infinity;
        let right_t = moveBox.right + movedx > fromBox.right ? (moveBox.right - fromBox.right) / (fromdx - movedx) : Infinity;
        let top_t = moveBox.top + movedy < fromBox.top ? (moveBox.top - fromBox.top) / (fromdy - movedy) : Infinity;
        let bottom_t = moveBox.bottom + movedy > fromBox.bottom ? (moveBox.bottom - fromBox.bottom) / (fromdy - movedy) : Infinity;

        let t = Math.min(left_t, right_t, top_t, bottom_t);

        moveBox.x += movedx;
        moveBox.y += movedy;
        fromBox.x += fromdx;
        fromBox.y += fromdy;

        if (!isFinite(t) && fromdx === movedx && fromdy === movedy) {
            t = 0;
        }

        if (!isFinite(t)) {
            console.error(`Failed to detect time of collision between rect and inverted rect:`, move.parent, moveBox, movedx, movedy, from.parent, fromBox, fromdx, fromdy);
        }

        let result = <Bounds.RaycastCollision>getDisplacementCollisionRectInvertedRect(move, from);
        result.t = t;

        return result;
    }

    export function getRaycastCollisionRectInvertedCircle(move: RectBounds, movedx: number, movedy: number, from: InvertedCircleBounds, fromdx: number, fromdy: number) {
        if (!move.isOverlapping(from)) return undefined;

        let moveBox = move.getBoundingBox();
        moveBox.x -= movedx;
        moveBox.y -= movedy;
        let fromPos = from.getCenter();
        fromPos.x -= fromdx;
        fromPos.y -= fromdy;

        let dx = moveBox.x + moveBox.width/2 - fromPos.x;
        let dy = moveBox.y + moveBox.height/2 - fromPos.y;

        let cornerx = moveBox.x + (dx < 0 ? 0 : moveBox.width);
        let cornery = moveBox.y + (dy < 0 ? 0 : moveBox.height);

        let t = raycastTimeCircleCircle(cornerx - fromPos.x, cornery - fromPos.y, movedx - fromdx, movedy - fromdy, from.radius);

        moveBox.x += movedx;
        moveBox.y += movedy;
        fromPos.x += fromdx;
        fromPos.y += fromdy;

        let result = <Bounds.RaycastCollision>getDisplacementCollisionRectInvertedCircle(move, from);
        result.t = t;

        return result;
    }

    export function isOverlappingCircleCircle(move: CircleBounds, from: CircleBounds) {
        let movePosition = move.getCenter();
        let fromPosition = from.getCenter();
        return M.distance(movePosition.x, movePosition.y, fromPosition.x, fromPosition.y) < move.radius + from.radius - OVERLAP_EPSILON;
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
        if (M.distanceSq(movePosition.x, movePosition.y, fromBox.left, fromBox.top) < move.radius*move.radius - OVERLAP_EPSILON) {
            return true;
        }

        if (M.distanceSq(movePosition.x, movePosition.y, fromBox.left, fromBox.bottom) < move.radius*move.radius - OVERLAP_EPSILON) {
            return true;
        }

        if (M.distanceSq(movePosition.x, movePosition.y, fromBox.right, fromBox.bottom) < move.radius*move.radius - OVERLAP_EPSILON) {
            return true;
        }

        if (M.distanceSq(movePosition.x, movePosition.y, fromBox.right, fromBox.top) < move.radius*move.radius - OVERLAP_EPSILON) {
            return true;
        }

        return false;
    }

    export function isOverlappingCircleSlope(move: CircleBounds, from: SlopeBounds) {
        let movePos = move.getCenter();
        let fromBox = from.getBoundingBox();

        let centerInBox = fromBox.contains(movePos.x, movePos.y);
        let centerInSlope = (from.direction === 'upright' && movePos.y > fromBox.height/fromBox.width * (movePos.x - fromBox.left) + fromBox.top)
                         || (from.direction === 'upleft' && movePos.y > -fromBox.height/fromBox.width * (movePos.x - fromBox.left) + fromBox.bottom)
                         || (from.direction === 'downleft' && movePos.y < fromBox.height/fromBox.width * (movePos.x - fromBox.left) + fromBox.top)
                         || (from.direction === 'downright' && movePos.y < -fromBox.height/fromBox.width * (movePos.x - fromBox.left) + fromBox.bottom);

        if (centerInBox && centerInSlope) {
            return true;
        }

        // Top edge
        if (from.direction !== 'upleft' && from.direction !== 'upright' && fromBox.left < movePos.x && movePos.x < fromBox.right && fromBox.top - move.radius < movePos.y && movePos.y <= fromBox.top) {
            return true;
        }

        // Bottom edge
        if (from.direction !== 'downleft' && from.direction !== 'downright' && fromBox.left < movePos.x && movePos.x < fromBox.right && fromBox.bottom <= movePos.y && movePos.y < fromBox.bottom + move.radius) {
            return true;
        }

        // Left edge
        if (from.direction !== 'upleft' && from.direction !== 'downleft' && fromBox.left - move.radius < movePos.x && movePos.x <= fromBox.left && fromBox.top < movePos.y && movePos.y < fromBox.bottom) {
            return true;
        }

        // Right edge
        if (from.direction !== 'upright' && from.direction !== 'downright' && fromBox.right <= movePos.x && movePos.x < fromBox.right + move.radius && fromBox.top < movePos.y && movePos.y < fromBox.bottom) {
            return true;
        }

        // Top-left vertex
        if (from.direction !== 'upleft' && M.distanceSq(movePos.x, movePos.y, fromBox.left, fromBox.top) < move.radius*move.radius - OVERLAP_EPSILON) {
            return true;
        }

        // Top-right vertex
        if (from.direction !== 'upright' && M.distanceSq(movePos.x, movePos.y, fromBox.right, fromBox.top) < move.radius*move.radius - OVERLAP_EPSILON) {
            return true;
        }

        // Bottom-right vertex
        if (from.direction !== 'downright' && M.distanceSq(movePos.x, movePos.y, fromBox.right, fromBox.bottom) < move.radius*move.radius - OVERLAP_EPSILON) {
            return true;
        }

        // Bottom-left vertex
        if (from.direction !== 'downleft' && M.distanceSq(movePos.x, movePos.y, fromBox.left, fromBox.bottom) < move.radius*move.radius - OVERLAP_EPSILON) {
            return true;
        }

        // sloped edge /
        if (from.direction !== 'upright' && from.direction !== 'downleft' && G.circleIntersectsSegment(movePos.x, movePos.y, move.radius, fromBox.left, fromBox.bottom, fromBox.right, fromBox.top)) {
            return true;
        }

        // sloped edge \
        if (from.direction !== 'upleft' && from.direction !== 'downright' && G.circleIntersectsSegment(movePos.x, movePos.y, move.radius, fromBox.left, fromBox.top, fromBox.right, fromBox.bottom)) {
            return true;
        }

        return false;
    }

    export function isOverlappingCircleInvertedRect(move: CircleBounds, from: InvertedRectBounds) {
        let movePos = move.getCenter();
        let fromBox = from.getInnerBox();

        if (movePos.x - move.radius < fromBox.left) return true;
        if (movePos.x + move.radius > fromBox.right) return true;
        if (movePos.y - move.radius < fromBox.top) return true;
        if (movePos.y + move.radius > fromBox.bottom) return true;

        return false;
    }

    export function isOverlappingCircleInvertedCircle(move: CircleBounds, from: InvertedCircleBounds) {
        let movePosition = move.getCenter();
        let fromPosition = from.getCenter();
        return M.distance(movePosition.x, movePosition.y, fromPosition.x, fromPosition.y) > from.radius - move.radius + OVERLAP_EPSILON;
    }

    export function isOverlappingRectRect(move: RectBounds, from: RectBounds) {
        return G.overlapRectangles(move.getBoundingBox(), from.getBoundingBox());
    }

    export function isOverlappingRectSlope(move: RectBounds, from: SlopeBounds) {
        let moveBox = move.getBoundingBox();
        let fromBox = from.getBoundingBox();

        if (!G.overlapRectangles(moveBox, fromBox)) return false;

        if (from.direction === 'upleft' && moveBox.bottom <= -fromBox.height/fromBox.width * (moveBox.right - fromBox.left) + fromBox.bottom) return false;
        if (from.direction === 'upright' && moveBox.bottom <= fromBox.height/fromBox.width * (moveBox.left - fromBox.left) + fromBox.top) return false;
        if (from.direction === 'downright' && moveBox.top >= -fromBox.height/fromBox.width * (moveBox.left - fromBox.left) + fromBox.bottom) return false;
        if (from.direction === 'downleft' && moveBox.top >= fromBox.height/fromBox.width * (moveBox.right - fromBox.left) + fromBox.top) return false;

        return true;
    }

    export function isOverlappingRectInvertedRect(move: RectBounds, from: InvertedRectBounds) {
        let moveBox = move.getBoundingBox();
        let fromBox = from.getInnerBox();

        if (moveBox.left < fromBox.left) return true;
        if (moveBox.right > fromBox.right) return true;
        if (moveBox.top < fromBox.top) return true;
        if (moveBox.bottom > fromBox.bottom) return true;

        return false;
    }

    export function isOverlappingRectInvertedCircle(move: RectBounds, from: InvertedCircleBounds) {
        let moveBox = move.getBoundingBox();
        let fromPos = from.getCenter();

        // Vertices
        if (M.distanceSq(moveBox.left, moveBox.top, fromPos.x, fromPos.y) > from.radius*from.radius + OVERLAP_EPSILON) {
            return true;
        }

        if (M.distanceSq(moveBox.right, moveBox.top, fromPos.x, fromPos.y) > from.radius*from.radius + OVERLAP_EPSILON) {
            return true;
        }

        if (M.distanceSq(moveBox.left, moveBox.bottom, fromPos.x, fromPos.y) > from.radius*from.radius + OVERLAP_EPSILON) {
            return true;
        }

        if (M.distanceSq(moveBox.right, moveBox.bottom, fromPos.x, fromPos.y) > from.radius*from.radius + OVERLAP_EPSILON) {
            return true;
        }

        return false;
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

    function closestPointOnCircle_angle(px: number, py: number, cx: number, cy: number) {
        let dx = px - cx;
        let dy = py - cy;
        return M.atan2(dy, dx);
    }

    function closestPointOnLine_t(px: number, py: number, lx1: number, ly1: number, lx2: number, ly2: number) {
        let dx = px - lx1;
        let dy = py - ly1;
        let ldx = lx2 - lx1;
        let ldy = ly2 - ly1;
        let t = (dx*ldx + dy*ldy) / (ldx*ldx + ldy*ldy);
        return t;
    }

    function raycastTimeCircleCircle(dx: number, dy: number, ddx: number, ddy: number, R: number) {
        let a = ddx*ddx + ddy*ddy;
        let b = 2*dx*ddx + 2*dy*ddy;
        let c = dx*dx + dy*dy - R*R;

        let disc = b*b - 4*a*c;
        if (disc < 0) return Infinity;

        return (-b - Math.sqrt(disc)) / (2*a);
    }

    function raycastTimeCircleInvertedCircle(dx: number, dy: number, ddx: number, ddy: number, R: number) {
        let a = ddx*ddx + ddy*ddy;
        let b = 2*dx*ddx + 2*dy*ddy;
        let c = dx*dx + dy*dy - R*R;

        let disc = b*b - 4*a*c;
        if (disc < 0) return Infinity;

        return (-b + Math.sqrt(disc)) / (2*a);
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

    function raycastTimePointSegment(dpx: number, dpy: number, ddx: number, ddy: number, linedx: number, linedy: number) {
        let t = (linedy*dpx - linedx*dpy) / (linedx*ddy - linedy*ddx);
        let s = linedx !== 0 ? (dpx + ddx*t) / linedx : (dpy + ddy*t) / linedy;
        if (s < 0 || 1 < s) return Infinity;
        return t;
    }

    function vectorBetweenVectors(vx: number, vy: number, x1: number, y1: number, x2: number, y2: number) {
        let cross1xV = x1*vy - y1*vx;
        let cross1x2 = x1*y2 - y1*x2;
        let cross2xV = x2*vy - y2*vx;
        let cross2x1 = x2*y1 - y2*x1;
        return cross1xV * cross1x2 >= 0 && cross2xV * cross2x1 >= 0;
    }
}