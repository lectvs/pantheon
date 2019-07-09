namespace A {
    export function clone<T>(array: T[]) {
        if (_.isEmpty(array)) return [];
        return Array.from(array);
    }

    export function clone2D<T>(array: T[][]) {
        if (_.isEmpty(array)) return [];
        return array.map(line => clone(line));
    }

    export function filledArray<T>(n: number, fillWith?: T) {
        let result: T[] = [];
        for (let i = 0; i < n; i++) {
            result.push(fillWith);
        }
        return result;
    }

    export function filledArray2D<T>(n: number, m: number, fillWith?: T) {
        let result: T[][] = [];
        for (let i = 0; i < n; i++) {
            let line: T[] = [];
            for (let j = 0; j < m; j++) {
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

    export function removeAll<T>(array: T[], obj: T) {
        if (!array) return 0;

        let count = 0;
        for (let i = array.length-1; i >= 0; i--) {
            if (array[i] === obj) {
                array.splice(i, 1);
                count++;
            }
        }

        return count;
    }

    export function repeat<T>(array: T[], count: number) {
        let result: T[] = [];
        for (let i = 0; i < count; i++) {
            result.push(...array);
        }
        return result;
    }
}