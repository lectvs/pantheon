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

        export function outFromIn(inFn: Function): Function {
            return t => 1 - inFn(1-t);
        }

        export function inOutFromIn(inFn: Function): Function {
            return t => t <= 0.5 ? inFn(2*t)/2 : 1 - inFn(2*(1-t))/2;
        }

        /* Easing Functions */
        export const Linear: Function = t => t;

        export const InPow: (pow: number) => Function = pow => (t => t**pow);
        export const OutPow: (pow: number) => Function = pow => outFromIn(InPow(pow));
        export const InOutPow: (pow: number) => Function = pow => inOutFromIn(InPow(pow));

        export const InQuad = InPow(2);
        export const OutQuad = OutPow(2);
        export const InOutQuad = InOutPow(2);

        export const InCubic = InPow(3);
        export const OutCubic = OutPow(3);
        export const InOutCubic = InOutPow(3);

        export const InExpPow: (pow: number) => Function = pow => t => t*2**(8.25*pow*(t-1));
        export const OutExpPow: (pow: number) => Function = pow => outFromIn(InExpPow(pow));
        export const InOutExpPow: (pow: number) => Function = pow => inOutFromIn(InExpPow(pow));

        export const InExp = InExpPow(1);
        export const OutExp = OutExpPow(1);
        export const InOutExp = InOutExpPow(1);

        export const InBounce: (bounceScale: number) => Function = bounceScale => t => (bounceScale+1)*t**3 - bounceScale*t**2;
        export const OutBounce: (bounceScale: number) => Function = bounceScale => outFromIn(InBounce(bounceScale));
        export const InOutBounce: (bounceScale: number) => Function = bounceScale => inOutFromIn(InBounce(bounceScale));

        export const InElastic: (elasticity: number) => Function = elasticity => t => {
            if (elasticity === 0) return t;
            if (t === 0) return 0;
            if (t === 1) return 1;
            return -Math.pow(2, (10*t - 10)/elasticity) * M.sin((10*t - 10.75) * 120);
        };
        export const OutElastic: (elasticity: number) => Function = elasticity => outFromIn(InElastic(elasticity));
        export const InOutElastic: (elasticity: number) => Function = elasticity => inOutFromIn(InElastic(elasticity));


        export const OscillateSine: (cyclesPerSecond: number) => Function = cyclesPerSecond => (t => (1 - M.cos(t * 360 * cyclesPerSecond))/2);
    }
}