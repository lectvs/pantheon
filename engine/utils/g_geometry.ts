namespace G {
    /**
     * Returns the angle of the vector from p1 to p2.
     */
    export function angle(p1: Pt, p2: Pt) {
        return M.angle(p2.x - p1.x, p2.y - p1.y);
    }

    export function areRectanglesOverlapping(rect1: Rect, rect2: Rect) {
        return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    }

    export function average(...ps: Pt[]) {
        if (A.isEmpty(ps)) {
            return undefined;
        }

        let sum = vec2(0, 0);
        for (let p of ps) {
            sum.add(p);
        }
        sum.scale(1 / ps.length);
        return sum;
    }

    export function chirality(points: Pt[]): -1 | 0 | 1 {
        if (A.size(points) <= 2) return 0;

        let averageX = A.average(points, p => p.x);
        let averageY = A.average(points, p => p.y);

        let d0 = tmp.vec2_1(points[0]).subtract(averageX, averageY);
        let d1 = tmp.vec2_2(points[1]).subtract(averageX, averageY);

        return M.angleDiff(d1.angle, d0.angle) > 0 ? -1 : 1;
    }

    export function circleIntersectsSegment(cx: number, cy: number, r: number, lx1: number, ly1: number, lx2: number, ly2: number) {
        let dx = cx - lx1;
        let dy = cy - ly1;
        let ldx = lx2 - lx1;
        let ldy = ly2 - ly1;
        let t = (dx*ldx + dy*ldy) / (ldx*ldx + ldy*ldy);
        
        if (M.distanceSq(dx, dy, ldx*t, ldy*t) >= r*r - 0.00000001) return false;

        let tInRange = 0 < t && t < 1;
        let intersectsVertex1 = M.distanceSq(0, 0, dx, dy) < r*r;
        let intersectsVertex2 = M.distanceSq(ldx, ldy, dx, dy) < r*r;

        return tInRange || intersectsVertex1 || intersectsVertex2;
    }

    export function distance(pt1: Pt, pt2: Pt) {
        return M.distance(pt1.x, pt1.y, pt2.x, pt2.y);
    }

    export function distanceSq(pt1: Pt, pt2: Pt) {
        return M.distanceSq(pt1.x, pt1.y, pt2.x, pt2.y);
    }

    export function distancePointToLine(px: number, py: number, lx1: number, ly1: number, lx2: number, ly2: number) {
        let dx = px - lx1;
        let dy = py - ly1;
        let ldx = lx2 - lx1;
        let ldy = ly2 - ly1;
        return Math.abs(dy*ldx - dx*ldy) / (ldx*ldx + ldy*ldy);
    }

    export function dot(v1: Pt, v2: Pt) {
        return v1.x*v2.x + v1.y*v2.y;
    }

    export function dotNormalized(v1: Pt, v2: Pt) {
        let mag1 = magnitude(v1);
        let mag2 = magnitude(v2);
        if (mag1 === 0 || mag2 === 0) return 0;
        return (v1.x*v2.x + v1.y*v2.y) / mag1 / mag2;
    }

    export function expandBoundaries<T extends Bndries>(bndries: T, amount: number): T {
        bndries.left -= amount;
        bndries.top -= amount;
        bndries.right += amount;
        bndries.bottom += amount;
        return bndries;
    }

    export function expandRectangle<T extends Rect>(rect: T, amount: number): T {
        rect.x -= amount;
        rect.y -= amount;
        rect.width += 2*amount;
        rect.height += 2*amount;
        return rect;
    }

    export function generatePolygonVertices(cx: number, cy: number, r: number, n: number, angle: number = 0) {
        return A.range(n).map(i => vec2(cx + r*M.cos(angle + 360/n*(i+0.5)), cy + r*M.sin(angle + 360/n*(i+0.5))));
    }

    export function generateStarVertices(cx: number, cy: number, rmin: number, rmax: number, n: number, angle: number = 0) {
        return A.range(n*2).map(i => i % 2
            ? vec2(cx + rmax*M.cos(angle + 180/n*(i+0.5)), cy + rmax*M.sin(angle + 180/n*(i+0.5)))
            : vec2(cx + rmin*M.cos(angle + 180/n*(i+0.5)), cy + rmin*M.sin(angle + 180/n*(i+0.5))));
    }

    export function getClosest45DegreeDirection$(vector: Vector2) {
        let angle = vector.angle;
        if (vector.isZero()) return FrameCache.vec2(0, 0);
        if (angle >= 22.5 && angle < 67.5) return FrameCache.vec2(Math.SQRT2, Math.SQRT2);
        if (angle >= 67.5 && angle < 112.5) return FrameCache.vec2(0, 1);
        if (angle >= 112.5 && angle < 157.5) return FrameCache.vec2(-Math.SQRT2, Math.SQRT2);
        if (angle >= 157.5 && angle < 202.5) return FrameCache.vec2(-1, 0);
        if (angle >= 202.5 && angle < 247.5) return FrameCache.vec2(-Math.SQRT2, -Math.SQRT2);
        if (angle >= 247.5 && angle < 292.5) return FrameCache.vec2(0, -1);
        if (angle >= 292.5 && angle < 337.5) return FrameCache.vec2(Math.SQRT2, -Math.SQRT2);
        return FrameCache.vec2(1, 0);
    }

    export function getClosestCardinalDirection$(vector: Vector2) {
        let angle = vector.angle;
        if (vector.isZero()) return FrameCache.vec2(0, 0);
        if (angle > 45 && angle < 135) return FrameCache.vec2(0, 1);
        if (angle >= 135 && angle <= 225) return FrameCache.vec2(-1, 0);
        if (angle > 225 && angle < 315) return FrameCache.vec2(0, -1);
        return FrameCache.vec2(1, 0);
    }

    export function getEncompassingBoundaries$(objs: (Pt | Rect | Bndries)[]): Boundaries {
        let minLeft: number | undefined;
        let maxRight: number | undefined;
        let minTop: number | undefined;
        let maxBottom: number | undefined;

        for (let obj of objs) {
            let left: number;
            let right: number;
            let top: number;
            let bottom: number;

            if ('left' in obj) {
                left = obj.left;
                right = obj.right;
                top = obj.top;
                bottom = obj.bottom;
            } else if ('width' in obj) {
                left = obj.x;
                right = obj.x + obj.width;
                top = obj.y;
                bottom = obj.y + obj.height;
            } else {
                left = obj.x;
                right = obj.x;
                top = obj.y;
                bottom = obj.y;
            }

            if (minLeft === undefined || left < minLeft) minLeft = left;
            if (maxRight === undefined || right > maxRight) maxRight = right;
            if (minTop === undefined || top < minTop) minTop = top;
            if (maxBottom === undefined || bottom > maxBottom) maxBottom = bottom;
        }

        return FrameCache.boundaries(
            minLeft !== undefined && isFinite(minLeft) ? minLeft : -Infinity,
            maxRight !== undefined && isFinite(maxRight) ? maxRight : Infinity,
            minTop !== undefined && isFinite(minTop) ? minTop : -Infinity,
            maxBottom !== undefined && isFinite(maxBottom) ? maxBottom : Infinity,
        );
    }

    export function getRectangleOverlap$(rect1: Rect, rect2: Rect) {
        let x = Math.max(rect1.x, rect2.x);
        let w = Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - x;
        let y = Math.max(rect1.y, rect2.y);
        let h = Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - y;
        if (w < 0 || h < 0) return undefined;
        return FrameCache.rectangle(x, y, w, h);
    }

    export function lerpPt(pt1: Pt, pt2: Pt, t: number) {
        return vec2(M.lerp(t, pt1.x, pt2.x), M.lerp(t, pt1.y, pt2.y));
    }

    export function magnitude(pt: Pt) {
        return Math.sqrt(magnitudeSq(pt));
    }

    export function magnitudeSq(pt: Pt) {
        return pt.x*pt.x + pt.y*pt.y;
    }

    export function moveToClamp(current: Pt, to: Pt, speed: number, delta: number) {
        if (G.distance(current, to) <= speed * delta) {
            current.x = to.x;
            current.y = to.y;
            return current;
        }
        let d = tmp.vec2(to.x - current.x, to.y - current.y).setMagnitude(speed * delta);
        current.x += d.x;
        current.y += d.y;
        return current;
    }

    export function rectContainsPt(rect: Rect, pt: Pt) {
        return pt.x >= rect.x && pt.y >= rect.y && pt.x <= rect.x + rect.width && pt.y <= rect.y + rect.height;
    }

    export function rectContainsRect(rect: Rect, contains: Rect) {
        return rect.x <= contains.x && rect.x + rect.width  >= contains.x + contains.width
            && rect.y <= contains.y && rect.y + rect.height >= contains.y + contains.height;
    }

    export function rotateAround(pt: Pt, around: Pt, angle: number) {
        let currentAngle = M.atan2(pt.y - around.y, pt.x - around.x);
        let newAngle = currentAngle + angle;
        let dist = distance(pt, around);
        pt.x = around.x + M.cos(newAngle) * dist;
        pt.y = around.y + M.sin(newAngle) * dist;
    }

    export function shiftPts<T extends Pt>(pts: T[], dx: number, dy: number): T[] {
        for (let pt of pts) {
            pt.x += dx;
            pt.y += dy;
        }
        return pts;
    }
}