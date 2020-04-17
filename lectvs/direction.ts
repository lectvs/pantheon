class Direction2D {
    v: number;
    h: number;

    static get UP() { return Direction.TOP_CENTER }
    static get DOWN() { return Direction.BOTTOM_CENTER }
    static get LEFT() { return Direction.CENTER_LEFT }
    static get RIGHT() { return Direction.CENTER_RIGHT }
}

class Direction {
    static get TOP() { return -1; }
    static get CENTER() { return 0; }
    static get BOTTOM() { return 1; }
    static get LEFT() { return -1; }
    static get RIGHT() { return 1; }
    static get UP() { return -1; }
    static get DOWN() { return 1; }
    static get NONE() { return 0; }
    static get TOP_LEFT(): Direction2D { return { v: Direction.TOP, h: Direction.LEFT } }
    static get TOP_CENTER(): Direction2D { return { v: Direction.TOP, h: Direction.CENTER } }
    static get TOP_RIGHT(): Direction2D { return { v: Direction.TOP, h: Direction.RIGHT } }
    static get CENTER_LEFT(): Direction2D { return { v: Direction.CENTER, h: Direction.LEFT } }
    static get CENTER_CENTER(): Direction2D { return { v: Direction.CENTER, h: Direction.CENTER } }
    static get CENTER_RIGHT(): Direction2D { return { v: Direction.CENTER, h: Direction.RIGHT } }
    static get BOTTOM_LEFT(): Direction2D { return { v: Direction.BOTTOM, h: Direction.LEFT } }
    static get BOTTOM_CENTER(): Direction2D { return { v: Direction.BOTTOM, h: Direction.CENTER } }
    static get BOTTOM_RIGHT(): Direction2D { return { v: Direction.BOTTOM, h: Direction.RIGHT } }

    static angleOf(direction: Direction2D) {
        return V.angle({ x: direction.h, y: direction.v });
    }

    // static closestDirection(angle: number, cardinalOnly: boolean = false) {
    //     let directions = [
    //         Direction.TOP_CENTER,
    //         Direction.CENTER_LEFT,
    //         Direction.BOTTOM_CENTER,
    //         Direction.CENTER_RIGHT
    //     ];

    //     if (!cardinalOnly) {
    //         directions.push(
    //             Direction.TOP_LEFT,
    //             Direction.TOP_RIGHT,
    //             Direction.BOTTOM_RIGHT,
    //             Direction.BOTTOM_LEFT
    //         );
    //     }

    //     return L.argmax(directions, direction => Math.abs(Phaser.Math.Angle.ShortestBetween(angle*Phaser.Math.RAD_TO_DEG, Direction.angleOf(direction)*Phaser.Math.RAD_TO_DEG)));
    // }

    static equals(d1: Direction2D, d2: Direction2D) {
        if (!d1 && !d2) return true;
        if (!d1 || !d2) return false;
        return d1.h == d2.h && d1.v == d2.v;
    }

    static rotatePointByDirection(x: number, y: number, direction: Direction2D) {
        if (Direction.equals(direction, Direction.CENTER_RIGHT)) {
            return { x: x, y: y };
        }
        if (Direction.equals(direction, Direction.TOP_CENTER)) {
            return { x: -y, y: x };
        }
        if (Direction.equals(direction, Direction.CENTER_LEFT)) {
            return { x: -x, y: -y };
        }
        if (Direction.equals(direction, Direction.BOTTOM_CENTER)) {
            return { x: y, y: -x };
        }
        debug("Direction", direction, "is not supported by rotatePointByDirection.");
        return { x, y };
    }

    static rotatePointBetweenDirections(x: number, y: number, startDirection: Direction2D, endDirection: Direction2D) {
        let pointFromStart = Direction.rotatePointByDirection(x, y, { h: startDirection.h, v: -startDirection.v });
        return Direction.rotatePointByDirection(pointFromStart.x, pointFromStart.y, endDirection);
    }
}
