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

    /* Calculates the height of a parabola that starts at startHeight, increases to startHeight + peakDelta, then falls to startHeight + groundDelta.
    0 <= t <= 1 is the percent completion of the jump. */
    export function jumpParabola(startHeight: number, peakDelta: number, groundDelta: number, t: number) {
        let a = 2*groundDelta - 4*peakDelta;
        let b = 4*peakDelta - groundDelta;
        return a*t*t + b*t + startHeight;
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
        if (!array) return NaN;
        let result = key(array[0]);

        for (let i = 1; i < array.length; i++) {
            let value = key(array[i]);
            if (value < result) result = value;
        }

        return result;
    }
}