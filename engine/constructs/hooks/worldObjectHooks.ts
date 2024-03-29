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

    export function oscillate(key: string, low: number, high: number, cyclesPerSecond: number) {
        return function(this: WorldObject) {
            (this as any)[key] = M.lerp(this.life.time, low, high, Tween.Easing.OscillateSine(cyclesPerSecond)) as any;
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