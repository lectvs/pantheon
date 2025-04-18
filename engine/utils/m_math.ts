namespace M {
    /**
     * Returns the angle of the vector <dx, dy> from the origin.
     */
    export function angle(dx: number, dy: number) {
        let angle = M.atan2(dy, dx);
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }

    /**
     * Computes the difference between angles, such that [from] + [diff] is
     * an equivalent angle to [to]
     */
    export function angleDiff(from: number, to: number) {
        from = M.mod(from, 360);
        to = M.mod(to, 360);
        if (Math.abs(to - from) < 180) return to - from;
        else if (to > from) return to - from - 360;
        else return  to - from + 360;
    }

    export function argmax<T>(array: T[], key: (x: T) => number): T | undefined {
        return argmin(array, x => -key(x));
    }

    export function argmin<T>(array: T[], key: (x: T) => number): T | undefined {
        if (!array || array.length == 0) return undefined;
        let result = array[0];
        let resultValue = key(array[0]);

        for (let i = 1; i < array.length; i++) {
            let value = key(array[i]);
            if (value < resultValue)  {
                result = array[i];
                resultValue = value;
            }
        }

        return result;
    }

    export function axis(neg: boolean, pos: boolean) {
        return (neg ? -1 : 0) + (pos ? 1 : 0);
    }

    export function batch(count: number, maxCount: number) {
        if (count <= maxCount) {
            return A.create(count, i => 1);
        }
    
        let q = Math.floor(count / maxCount);
        let r = count % maxCount;
    
        return A.create(maxCount, i => i < r ? q+1 : q);
    }

    export function ceilRelative(n: number, relativeTo: number) {
        return Math.ceil(n - relativeTo) + relativeTo;
    }

    export function ceilToNearest(n: number, unit: number) {
        return Math.ceil(n / unit) * unit;
    }

    export function clamp(val: number, min: number, max: number) {
        return val < min ? min : (val > max ? max : val);
    }

    export function degToRad(deg: number) {
        return Math.PI * deg / 180;
    }

    export function distance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt(distanceSq(x1, y1, x2, y2));
    }

    export function distanceSq(x1: number, y1: number, x2: number, y2: number) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return dx*dx + dy*dy;
    }

    export function equidistantLine(middle: number, d: number, n: number, i: number) {
        return middle - d*(n-1)/2 + d*i;
    }

    /**
     * Returns true iff the time t just passed a multiple of n, according to given delta.
     */
    export function everyNFloat(n: number, t: number, delta: number) {
        return Math.floor(t/n) !== Math.floor((t - delta)/n) || delta >= n;
    }

    /**
     * Returns true iff the value t is just passing a multiple of n.
     */
    export function everyNInt(n: number, t: number) {
        return Math.floor((t + 1)/n) !== Math.floor(t/n);
    }

    export function floorRelative(n: number, relativeTo: number) {
        return Math.floor(n - relativeTo) + relativeTo;
    }

    export function floorToNearest(n: number, unit: number) {
        return Math.floor(n / unit) * unit;
    }

    export function isInt(n: string) {
        return /^[+-]?\d+$/.test(n);
    }

    export function isNumber(obj: any): obj is number {
        return typeof obj === 'number';
    }

    /** 
     * Calculates the height of a parabola that starts at startHeight, increases to startHeight + peakDelta, then falls to startHeight + groundDelta.
     * 0 <= t <= 1 is the percent completion of the jump.
     */
    export function jumpParabola(startHeight: number, peakDelta: number, groundDelta: number, t: number) {
        let a = 2*groundDelta - 4*peakDelta;
        let b = 4*peakDelta - groundDelta;
        return a*t*t + b*t + startHeight;
    }

    export function lerp(t: number, a: number, b: number, fn?: Tween.Easing.Function) {
        if (fn) t = fn(t);
        return a*(1-t) + b*t;
    }

    export function lerpTime(a: number, b: number, speed: number, delta: number) {
        // From https://www.gamasutra.com/blogs/ScottLembcke/20180404/316046/Improved_Lerp_Smoothing.php
        return lerp(1-Math.pow(2, -speed*delta), a, b);
    }

    export function magnitude(dx: number, dy: number) {
        return Math.sqrt(magnitudeSq(dx, dy));
    }

    export function magnitudeSq(dx: number, dy: number) {
        return dx*dx + dy*dy;
    }

    export function map(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number, tweenFn?: Tween.Easing.Function) {
        let p = (value - fromMin) / (fromMax - fromMin);
        return lerp(p, toMin, toMax, tweenFn);
    }

    export function mapClamp(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number, tweenFn?: Tween.Easing.Function) {
        let clampMin = toMin <= toMax ? toMin : toMax;
        let clampMax = toMin <= toMax ? toMax : toMin;
        return clamp(map(value, fromMin, fromMax, toMin, toMax, tweenFn), clampMin, clampMax);
    }

    export function max<T>(array: T[], key: (x: T) => number) {
        return -min(array, x => -key(x));
    }

    export function min<T>(array: T[], key: (x: T) => number) {
        if (A.isEmpty(array)) return NaN;
        let result = key(array[0]);

        for (let i = 1; i < array.length; i++) {
            let value = key(array[i]);
            if (value < result) result = value;
        }

        return result;
    }

    export function minPowerOf2(num: number) {
        return Math.pow(2, Math.ceil(Math.log2(num)));
    }

    export function mod(num: number, mod: number) {
        mod = Math.abs(mod);
        return num - Math.floor(num/mod) * mod;
    }

    /**
     * Mods num to ensure that num and target are in the same interval [n*mod, (n+1)*mod)
     */
    export function modToSameInterval(num: number, target: number, mod: number) {
        let base = floorToNearest(target, mod);
        return M.mod(num, mod) + base;
    }

    export function moveToAngleClamp(current: number, to: number, speed: number, delta: number, biasFor180?: -1 | 1) {
        current = modToSameInterval(current, to, 360);
        let diff = angleDiff(current, to);
        let moveMagnitude = speed * delta;

        if (moveMagnitude > Math.abs(diff)) {
            return to;
        }

        let moveDirection = Math.sign(diff);

        if (Math.abs(diff) === 180 && biasFor180 !== undefined) {
            moveDirection = biasFor180;
        }

        return current + moveMagnitude * moveDirection;
    }

    export function moveToClamp(current: number, to: number, speed: number, delta: number) {
        if (to > current) return Math.min(current + speed * delta, to);
        if (to < current) return Math.max(current - speed * delta, to);
        return current;
    }

    export function oscillateN(n: number, t: number) {
        return Math.floor(t/n) % 2 === 1;
    }

    export function periodic(fn: (x: number) => number, period: number) {
        return (x: number) => fn(mod(x, period));
    }

    export function radToDeg(rad: number) {
        return 180 / Math.PI * rad;
    }

    export function roundRelative(n: number, relativeTo: number) {
        return Math.round(n - relativeTo) + relativeTo;
    }

    export function roundToNearest(n: number, unit: number) {
        return Math.round(n / unit) * unit;
    }

    export function snapToIntRemoveFloatError(x: number) {
        let closestInt = Math.round(x);
        if (Math.abs(x - closestInt) < 1e-10) return closestInt;
        return x;
    }


    // Degree-based Trig
    export function cos(angle: number) {
        return Math.cos(degToRad(angle));
    }

    export function sin(angle: number) {
        return Math.sin(degToRad(angle));
    }

    export function tan(angle: number) {
        return Math.tan(degToRad(angle));
    }

    export function asin(sin: number) {
        return radToDeg(Math.asin(sin));
    }

    export function acos(cos: number) {
        return radToDeg(Math.acos(cos));
    }

    export function atan(tan: number) {
        return radToDeg(Math.atan(tan));
    }

    export function atan2(tany: number, tanx: number) {
        return radToDeg(Math.atan2(tany, tanx));
    }
}