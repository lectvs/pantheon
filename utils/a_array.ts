namespace A {
    export function clone<T>(array: ReadonlyArray<T>) {
        if (_.isEmpty(array)) return [];
        return Array.from(array);
    }

    export function clone2D<T>(array: T[][]) {
        if (_.isEmpty(array)) return [];
        return array.map(line => clone(line));
    }

    export function emptyArray<T>(n: number) {
        return filledArray<T>(n);
    }

    export function filledArray<T>(n: number, fillWith?: T) {
        let result: T[] = [];
        for (let i = 0; i < n; i++) {
            result.push(fillWith);
        }
        return result;
    }

    export function filledArray2D<T>(rows: number, cols: number, fillWith?: T) {
        let result: T[][] = [];
        for (let i = 0; i < rows; i++) {
            let line: T[] = [];
            for (let j = 0; j < cols; j++) {
                line.push(fillWith);
            }
            result.push(line);
        }
        return result;
    }

    export function get2DArrayDimensions(array: any[][]): Dimens {
        if (_.isEmpty(array)) return { width: 0, height: 0 };
        return { width: M.max(array, line => _.isEmpty(line) ? 0 : line.length), height: array.length };
    }

    export function map2D<T,S>(array: T[][], fn: (a: T) => S) {
        if (_.isEmpty(array)) return [];
        return array.map(line => _.isEmpty(line) ? [] : line.map(fn));
    }

    export function mergeArray<T>(array: T[], into: T[], key: (element: T) => any, combine: (e: T, into: T) => T = ((e, into) => e)) {
        let result = A.clone(into);
        for (let element of array) {
            let resultContainedKey = false;
            for (let i = 0; i < result.length; i++) {
                if (key(element) === key(result[i])) {
                    result[i] = combine(element, result[i]);
                    resultContainedKey = true;
                    break;
                }
            }
            if (!resultContainedKey) {
                result.push(element);
            }
        }
        return result;
    }

    export function range(n: number) {
        return [...Array(n).keys()];
    }

    export function removeAll<T>(array: T[], obj: T, startingAt: number = 0) {
        if (!array) return 0;

        let count = 0;
        for (let i = array.length-1; i >= startingAt; i--) {
            if (array[i] === obj) {
                array.splice(i, 1);
                count++;
            }
        }

        return count;
    }

    export function removeDuplicates<T>(array: T[]) {
        for (let i = 0; i < array.length - 1; i++) {
            removeAll(array, array[i], i+1);
        }
        return array;
    }

    export function repeat<T>(array: T[], count: number) {
        let result: T[] = [];
        for (let i = 0; i < count; i++) {
            result.push(...array);
        }
        return result;
    }

    /**
     * Sorts in ascending order by default.
     */
    export function sort<T>(array: T[], key: (t: T) => number, reverse: boolean = false) {
        let r = reverse ? -1 : 1;
        return array.sort((a,b) => r*(key(a)-key(b)));
    }

    /**
     * Sorts in ascending order by default.
     */
    export function sorted<T>(array: T[], key: (t: T) => number, reverse: boolean = false) {
        return A.sort(A.clone(array), key, reverse);
    }

    export function sum(array: any[], key: (e: any) => number = (e => e)) {
        if (_.isEmpty(array)) return 0;
        let result = 0;
        for (let i = 0; i < array.length; i++) {
            result += key(array[i]);
        }
        return result;
    }
}