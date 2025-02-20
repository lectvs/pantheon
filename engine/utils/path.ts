abstract class Path {
    abstract readonly maxDistance: number;

    abstract getX(distance: number): number;
    abstract getY(distance: number): number;

    private pos = new Vector2(0, 0);
    getPosition$(distance: number) {
        this.pos.x = this.getX(distance);
        this.pos.y = this.getY(distance);
        return this.pos;
    }

    travelScript(speed: number, callback: (pos$: Vector2) => void, easingFn?: Tween.Easing.Function) {
        let path = this;
        return function*() {
            let distance = 0;
            while (distance < path.maxDistance) {
                let tweenedDistance = M.lerp(distance / path.maxDistance, 0, path.maxDistance, easingFn);
                callback(path.getPosition$(tweenedDistance));
                distance += speed * global.script.delta;
                yield;
            }
            callback(path.getPosition$(path.maxDistance));
        }
    }
}

namespace Path {
    export class Line extends Path {
        readonly maxDistance: number;

        constructor(private fromX: number, private fromY: number, private toX: number, private toY: number) {
            super();

            this.maxDistance = M.distance(fromX, fromY, toX, toY);
        }

        override getX(distance: number): number {
            return this.fromX + (this.toX - this.fromX) / this.maxDistance * distance;
        }

        override getY(distance: number): number {
            return this.fromY + (this.toY - this.fromY) / this.maxDistance * distance;
        }
    }
}