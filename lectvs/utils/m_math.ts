namespace M {
    export function argmax<T>(array: T[], key: (x: T) => number) {
        return this.argmin(array, x => -key(x));
    }

    export function argmin<T>(array: T[], key: (x: T) => number) {
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

    export function clamp(val: number, min: number, max: number) {
        return val < min ? min : (val > max ? max : val);
    }

    export function colorToVec3(color: number) {
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

    /* Calculates the height of a parabola that starts at startHeight, increases to startHeight + peakDelta, then falls to startHeight + groundDelta.
    0 <= t <= 1 is the percent completion of the jump. */
    export function jumpParabola(startHeight: number, peakDelta: number, groundDelta: number, t: number) {
        let a = 2*groundDelta - 4*peakDelta;
        let b = 4*peakDelta - groundDelta;
        return a*t*t + b*t + startHeight;
    }

    export function lerp(a: number, b: number, t: number) {
        return a*(1-t) + b*t;
    }

    export function lerpTime(a: number, b: number, speed: number, delta: number) {
        // From https://www.gamasutra.com/blogs/ScottLembcke/20180404/316046/Improved_Lerp_Smoothing.php
        return lerp(a, b, 1-Math.pow(2, -speed*delta));
    }

    export function magnitude(dx: number, dy: number) {
        return Math.sqrt(this.magnitudeSq(dx, dy));
    }

    export function magnitudeSq(dx: number, dy: number) {
        return dx*dx + dy*dy;
    }

    export function max<T>(array: T[], key: (x: T) => number) {
        return -this.min(array, x => -key(x));
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

    export function radToDeg(rad: number) {
        return 180 / Math.PI * rad;
    }

    export function vec3ToColor(vec3: [number, number, number]) {
        return (Math.round(vec3[0] * 255) << 16) + (Math.round(vec3[1] * 255) << 8) + Math.round(vec3[2] * 255);
    }
}