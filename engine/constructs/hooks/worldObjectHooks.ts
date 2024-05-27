namespace Hooks {
    export function enter(duration: number, initialValues: Actions.EnterInitialValues, easingFn?: Tween.Easing.Function, delay?: number) {
        return function(this: WorldObject) {
            Actions.enter(this, duration, initialValues, easingFn, delay);
        }
    }

    export function exit(duration: number, finalValues: Actions.ExitFinalValues, easingFn?: Tween.Easing.Function, delay?: number) {
        return function(this: WorldObject) {
            Actions.exit(this, duration, finalValues, easingFn, delay);
        }
    }

    export function keepAtBack() {
        return function(this: WorldObject) {
            World.Actions.moveWorldObjectToBack(this);
        }
    }

    export function keepAtFront() {
        return function(this: WorldObject) {
            World.Actions.moveWorldObjectToFront(this);
        }
    }

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

    export function killIf(condition: () => any) {
        return function(this: WorldObject) {
            if (condition()) {
                this.kill();
            }
        }
    }

    export function killIfOffScreenBounds(padding: number) {
        return function(this: WorldObject & { bounds: Bounds }) {
            if (this.world && !this.world.isBoundsOnScreen(this.bounds, padding)) {
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

    export function oscillate(path: string, low: number, high: number, cyclesPerSecond: number, offset: number = 0) {
        return function(this: WorldObject) {
            O.setPath(this, path, M.lerp(this.life.time + offset, low, high, Tween.Easing.OscillateSine(cyclesPerSecond)));
        }
    }

    export function shake(path: string, low: number, high: number, cyclesPerSecond: number) {
        return function(this: WorldObject) {
            O.setPath(this, path, this.oscillateNSeconds(1/cyclesPerSecond) ? low : high);
        }
    }

    export function tweenOverLifetime(key: string, start: number, end: number, tweenFn?: Tween.Easing.Function) {
        return function(this: WorldObject) {
            (this as any)[key] = M.lerp(this.life.progress, start, end, tweenFn) as any;
        }
    }
}