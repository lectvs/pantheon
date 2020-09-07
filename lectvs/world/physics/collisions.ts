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
            let newX = vx + Math.cos(angle) * move.radius;
            let newY = vy + Math.sin(angle) * move.radius;
            
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

    export function getDisplacementCollisionRectSlope(move: RectBounds, from: SlopeBounds) {
        return undefined;
    }

    export function getDisplacementCollisionSlopeCircle(move: SlopeBounds, from: CircleBounds) {
        return invertDisplacementCollision(getDisplacementCollisionCircleSlope(from, move));
    }

    export function getDisplacementCollisionSlopeRect(move: SlopeBounds, from: RectBounds) {
        return invertDisplacementCollision(getDisplacementCollisionRectSlope(from, move));
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

    export function getRaycastCollisionCircleSlope(move: CircleBounds, movedx: number, movedy: number, from: SlopeBounds, fromdx: number, fromdy: number) {
        if (!move.isOverlapping(from)) return undefined;

        let movePos = move.getCenter();
        let fromBox = from.getBoundingBox();

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

        let result = <Bounds.RaycastCollision>getDisplacementCollisionCircleSlope(move, from);
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

    export function getRaycastCollisionRectSlope(move: RectBounds, movedx: number, movedy: number, from: SlopeBounds, fromdx: number, fromdy: number) {
        return undefined;
    }

    export function getRaycastCollisionSlopeCircle(move: SlopeBounds, movedx: number, movedy: number, from: CircleBounds, fromdx: number, fromdy: number) {
        return invertRaycastCollision(getRaycastCollisionCircleSlope(from, fromdx, fromdy, move, movedx, movedy));
    }

    export function getRaycastCollisionSlopeRect(move: SlopeBounds, movedx: number, movedy: number, from: RectBounds, fromdx: number, fromdy: number) {
        return invertRaycastCollision(getRaycastCollisionRectSlope(from, fromdx, fromdy, move, movedx, movedy));
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
        if (from.direction !== 'upleft' && M.distanceSq(movePos.x, movePos.y, fromBox.left, fromBox.top) < move.radius*move.radius) {
            return true;
        }

        // Top-right vertex
        if (from.direction !== 'upright' && M.distanceSq(movePos.x, movePos.y, fromBox.right, fromBox.top) < move.radius*move.radius) {
            return true;
        }

        // Bottom-right vertex
        if (from.direction !== 'downright' && M.distanceSq(movePos.x, movePos.y, fromBox.right, fromBox.bottom) < move.radius*move.radius) {
            return true;
        }

        // Bottom-left vertex
        if (from.direction !== 'downleft' && M.distanceSq(movePos.x, movePos.y, fromBox.left, fromBox.bottom) < move.radius*move.radius) {
            return true;
        }

        // sloped edge /
        if (from.direction !== 'upright' && from.direction !== 'downleft' && circleIntersectsSegment(movePos.x, movePos.y, move.radius, fromBox.left, fromBox.bottom, fromBox.right, fromBox.top)) {
            return true;
        }

        // sloped edge \
        if (from.direction !== 'upleft' && from.direction !== 'downright' && circleIntersectsSegment(movePos.x, movePos.y, move.radius, fromBox.left, fromBox.top, fromBox.right, fromBox.bottom)) {
            return true;
        }

        return false;
    }

    export function isOverlappingRectRect(move: RectBounds, from: RectBounds) {
        return G.overlapRectangles(move.getBoundingBox(), from.getBoundingBox());
    }

    export function isOverlappingRectSlope(move: RectBounds, from: SlopeBounds) {
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

    function circleIntersectsSegment(cx: number, cy: number, r: number, lx1: number, ly1: number, lx2: number, ly2: number) {
        let dx = cx - lx1;
        let dy = cy - ly1;
        let ldx = lx2 - lx1;
        let ldy = ly2 - ly1;
        let t = (dx*ldx + dy*ldy) / (ldx*ldx + ldy*ldy);
        
        if (M.distanceSq(dx, dy, ldx*t, ldy*t) > r*r) return false;

        let tInRange = 0 < t && t < 1;
        let intersectsVertex1 = M.distanceSq(0, 0, dx, dy) < r*r;
        let intersectsVertex2 = M.distanceSq(ldx, ldy, dx, dy) < r*r;

        return tInRange || intersectsVertex1 || intersectsVertex2;
    }

    function closestPointOnCircle_angle(px: number, py: number, cx: number, cy: number) {
        let dx = px - cx;
        let dy = py - cy;
        return Math.atan2(dy, dx);
    }

    function closestPointOnLine_t(px: number, py: number, lx1: number, ly1: number, lx2: number, ly2: number) {
        let dx = px - lx1;
        let dy = py - ly1;
        let ldx = lx2 - lx1;
        let ldy = ly2 - ly1;
        let t = (dx*ldx + dy*ldy) / (ldx*ldx + ldy*ldy);
        return t;
    }

    function pointInSegmentSpan(px: number, py: number, lx1: number, ly1: number, lx2: number, ly2: number) {
        let dx = px - lx1;
        let dy = py - ly1;
        let ldx = lx2 - lx1;
        let ldy = ly2 - ly1;
        let t = (dx*ldx + dy*ldy) / (ldx*ldx + ldy*ldy);
        return 0 <= t && t <= 1;
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

    function vectorBetweenVectors(vx: number, vy: number, x1: number, y1: number, x2: number, y2: number) {
        let cross1xV = x1*vy - y1*vx;
        let cross1x2 = x1*y2 - y1*x2;
        let cross2xV = x2*vy - y2*vx;
        let cross2x1 = x2*y1 - y2*x1;
        return cross1xV * cross1x2 >= 0 && cross2xV * cross2x1 >= 0;
    }
}