namespace M {
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

    export function argmax<T>(array: T[], key: (x: T) => number): T {
        return argmin(array, x => -key(x));
    }

    export function argmin<T>(array: T[], key: (x: T) => number): T {
        if (!array || array.length == 0) return null;
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

    export function clamp(val: number, min: number, max: number) {
        return val < min ? min : (val > max ? max : val);
    }

    export function colorToVec3(color: number): [number, number, number] {
        let r = (color >> 16) & 255;
        let g = (color >> 8) & 255;
        let b = color & 255;
        return [r/255, g/255, b/255];
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

    export function floorRelative(n: number, relativeTo: number) {
        return Math.floor(n - relativeTo) + relativeTo;
    }

    export function isInt(n: string) {
        return /^[+-]?\d+$/.test(n);
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

    export function jumpVelocityForHeight(height: number, gravity: number) {
        return Math.sqrt(2*height*Math.abs(gravity));
    }

    export function lerp(a: number, b: number, t: number) {
        return a*(1-t) + b*t;
    }

    export function lerpTime(a: number, b: number, speed: number, delta: number) {
        // From https://www.gamasutra.com/blogs/ScottLembcke/20180404/316046/Improved_Lerp_Smoothing.php
        return lerp(a, b, 1-Math.pow(2, -speed*delta));
    }

    export function magnitude(dx: number, dy: number) {
        return Math.sqrt(magnitudeSq(dx, dy));
    }

    export function magnitudeSq(dx: number, dy: number) {
        return dx*dx + dy*dy;
    }

    export function map(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) {
        let p = (value - fromMin) / (fromMax - fromMin);
        return lerp(toMin, toMax, p);
    }

    export function mapClamp(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) {
        let clampMin = toMin <= toMax ? toMin : toMax;
        let clampMax = toMin <= toMax ? toMax : toMin;
        return clamp(map(value, fromMin, fromMax, toMin, toMax), clampMin, clampMax);
    }

    export function mapTween(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number, tweenFn: Tween.Easing.Function) {
        let p = (value - fromMin) / (fromMax - fromMin);
        return lerp(toMin, toMax, tweenFn(p));
    }

    export function max<T>(array: T[], key: (x: T) => number) {
        return -min(array, x => -key(x));
    }

    export function min<T>(array: T[], key: (x: T) => number) {
        if (_.isEmpty(array)) return NaN;
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

    export function moveToAngleClamp(current: number, to: number, speed: number, delta: number) {
        let diff = angleDiff(current, to);
        let d = speed * delta;

        if (diff > Math.abs(d)) return Math.min(current + d, to);
        if (diff < Math.abs(d)) return Math.max(current - d, to);
        return current + diff;
    }

    export function moveToClamp(current: number, to: number, speed: number, delta: number) {
        if (to > current) return Math.min(current + speed * delta, to);
        if (to < current) return Math.max(current - speed * delta, to);
        return current;
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

    export function vec3ToColor(vec3: [number, number, number]) {
        return (Math.round(vec3[0] * 255) << 16) + (Math.round(vec3[1] * 255) << 8) + Math.round(vec3[2] * 255);
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