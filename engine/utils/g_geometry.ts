namespace G {
    export function angle(p1: Pt, p2: Pt) {
        let angle = M.atan2(p2.y - p1.y, p2.x - p1.x);
        if (angle < 0) {
            angle += 360;
        }
        return angle;
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

    export function expandRectangle(rect: Rect, amount: number) {
        rect.x -= amount;
        rect.y -= amount;
        rect.width += 2*amount;
        rect.height += 2*amount;
    }

    export function generatePolygonVertices(cx: number, cy: number, r: number, n: number, angle: number = 0) {
        return A.range(n).map(i => vec2(cx + r*M.cos(angle + 360/n*(i+0.5)), cy + r*M.sin(angle + 360/n*(i+0.5))));
    }

    export function getEncompassingBoundaries(objs: (Pt | Rect | Bndries)[]): Boundaries {
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

        return new Boundaries(
            minLeft && isFinite(minLeft) ? minLeft : -Infinity,
            maxRight && isFinite(maxRight) ? maxRight : Infinity,
            minTop && isFinite(minTop) ? minTop : -Infinity,
            maxBottom && isFinite(maxBottom) ? maxBottom : Infinity,
        );
    }

    export function getRectangleOverlap(rect1: Rect, rect2: Rect) {
        let x = Math.max(rect1.x, rect2.x);
        let w = Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - x;
        let y = Math.max(rect1.y, rect2.y);
        let h = Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - y;
        if (w < 0 || h < 0) return undefined;
        return rect(x, y, w, h);
    }

    export function lerpPt(pt1: Pt, pt2: Pt, t: number) {
        return vec2(M.lerp(t, pt1.x, pt2.x), M.lerp(t, pt1.y, pt2.y));
    }

    export function moveToClamp(current: Vector2, to: Vector2, speed: number, delta: number) {
        if (G.distance(current, to) <= speed * delta) current.set(to);
        current.add(tmp.vec2(to.x - current.x, to.y - current.y).setMagnitude(speed * delta));
        return current;
    }

    export function rectContainsPt(rect: Rect, pt: Pt) {
        return pt.x >= rect.x && pt.y >= rect.y && pt.x < rect.x + rect.width && pt.y < rect.y + rect.height;
    }

    export function rectContainsRect(rect: Rect, contains: Rect) {
        return rect.x <= contains.x && rect.x + rect.width  >= contains.x + contains.width
            && rect.y <= contains.y && rect.y + rect.height >= contains.y + contains.height;
    }
}