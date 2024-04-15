namespace Hooks {
    export function keepBehind(obj: WorldObject) {
        return function(this: WorldObject) {
            World.Actions.orderWorldObjectBefore(this, obj);
        }
    }

    export function keepInFrontOf(obj: WorldObject) {
        return function(this: WorldObject) {
            World.Actions.orderWorldObjectAfter(this, obj);
        }
    }

    export function killIfOffScreenBounds(padding: number) {
        return function(this: WorldObject & { bounds: Bounds }) {
            if (this.world && !this.world.isRectOnScreen(this.bounds.getBoundingBox(), padding)) {
                this.kill();
            }
        }
    }

    export function killIfOffScreenCoords(padding: number) {
        return function(this: WorldObject) {
            if (this.world && !this.world.isPtOnScreen(this, padding)) {
                this.kill();
            }
        }
    }

    export function oscillate(key: string, low: number, high: number, cyclesPerSecond: number, offset: number = 0) {
        return function(this: WorldObject) {
            (this as any)[key] = M.lerp(this.life.time + offset, low, high, Tween.Easing.OscillateSine(cyclesPerSecond)) as any;
        }
    }

    export function shake(key: string, low: number, high: number, cyclesPerSecond: number) {
        return function(this: WorldObject) {
            (this as any)[key] = this.oscillateNSeconds(1/cyclesPerSecond) ? low : high;
        }
    }

    export function tweenOverLifetime(key: string, start: number, end: number, tweenFn?: Tween.Easing.Function) {
        return function(this: WorldObject) {
            (this as any)[key] = M.lerp(this.life.progress, start, end, tweenFn) as any;
        }
    }
}