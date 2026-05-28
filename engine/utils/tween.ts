namespace Tween {
    export namespace Easing {
        export type Function = (t: number) => number;

        export function zeroToOneClampedIn(inFn: Function): Function {
            return t => t <= 0 ? 0 : t >= 1 ? 1 : inFn(t);
        }

        export function outFromIn(inFn: Function): Function {
            return t => 1 - inFn(1-t);
        }

        export function inFromOut(outFn: Function): Function {
            return t => 1 - outFn(1-t);
        }

        export function inOutFromIn(inFn: Function): Function {
            return t => t <= 0.5 ? inFn(2*t)/2 : 1 - inFn(2*(1-t))/2;
        }

        /* Easing Functions */
        export const Linear: Function = t => t;

        export const InPow: (pow: number) => Function = pow => zeroToOneClampedIn(t => t**pow);
        export const OutPow: (pow: number) => Function = pow => outFromIn(InPow(pow));
        export const InOutPow: (pow: number) => Function = pow => inOutFromIn(InPow(pow));

        export const InQuad = InPow(2);
        export const OutQuad = OutPow(2);
        export const InOutQuad = InOutPow(2);

        export const InCubic = InPow(3);
        export const OutCubic = OutPow(3);
        export const InOutCubic = InOutPow(3);

        export const InExpPow: (pow: number) => Function = pow => zeroToOneClampedIn(t => t*2**(8.25*pow*(t-1)));
        export const OutExpPow: (pow: number) => Function = pow => outFromIn(InExpPow(pow));
        export const InOutExpPow: (pow: number) => Function = pow => inOutFromIn(InExpPow(pow));

        export const InExp = InExpPow(1);
        export const OutExp = OutExpPow(1);
        export const InOutExp = InOutExpPow(1);

        export const OutBounce: Function = zeroToOneClampedIn(t => {
            const n1 = 7.5625;
            const d1 = 2.75;

            if (t < 1 / d1) {
                return n1 * t * t;
            }
            if (t < 2 / d1) {
                return n1 * (t -= 1.5 / d1) * t + 0.75;
            }
            if (t < 2.5 / d1) {
                return n1 * (t -= 2.25 / d1) * t + 0.9375;
            }
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        });
        export const InBounce = inFromOut(OutBounce);
        export const InOutBounce = inOutFromIn(InBounce);

        export const InElastic: (elasticity: number) => Function = elasticity => zeroToOneClampedIn(t => {
            if (elasticity === 0) return t;
            return -Math.pow(2, (10*t - 10)/elasticity) * M.sin((10*t - 10.75) * 120);
        });
        export const OutElastic: (elasticity: number) => Function = elasticity => outFromIn(InElastic(elasticity));
        export const InOutElastic: (elasticity: number) => Function = elasticity => inOutFromIn(InElastic(elasticity));

        export const InElasticSimple: (elasticity: number) => Function = elasticity => zeroToOneClampedIn(t => {
            let e = elasticity/2;
            return 1 - (M.sin(90 - 180*t) + e*M.cos(180 - 360*t)+1+e)/2;
        });
        export const OutElasticSimple: (elasticity: number) => Function = elasticity => outFromIn(InElasticSimple(elasticity));
        export const InOutElasticSimple: (elasticity: number) => Function = elasticity => inOutFromIn(InElasticSimple(elasticity));

        export const OscillateSine: (cyclesPerSecond: number, cycleOffsetPercent?: number) => Function = (cyclesPerSecond, cycleOffsetPercent = 0) => (t => (1 - M.cos((t * cyclesPerSecond + cycleOffsetPercent) * 360))/2);
    }
}