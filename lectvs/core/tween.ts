class Tween {
    start: number;
    end: number;
    duration: number;
    easingFunction: Tween.Easing.Function;

    private timer: Timer;

    get done() { return this.timer.done; }
    get value() { return this.start + (this.end - this.start) * this.easingFunction(this.timer.progress); }

    constructor(start: number, end: number, duration: number, easingFunction: Tween.Easing.Function = Tween.Easing.Linear) {
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.easingFunction = easingFunction;

        this.timer = new Timer(duration);
    }

    update(delta: number) {
        this.timer.update(delta);
    }
}

namespace Tween {
    export namespace Easing {
        export type Function = (t: number) => number;

        export const Linear: Function = (t => t);
        export const Square: Function = (t => t**2);
        export const InvSquare: Function = (t => 1 - (1-t)**2);
    }
}