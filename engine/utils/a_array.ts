/// <reference path="./extensions.ts" />

namespace A {
    export const ALPHABET_LOWERCASE = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    export const ALPHABET_UPPERCASE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    export function average<T>(array: T[], key: (e: T) => number = (e => <any>e)) {
        if (isEmpty(array)) return NaN;
        return sum(array, key) / array.length;
    }

    export function batch<T>(array: ReadonlyArray<T>, batchSize: number) {
        let result: T[][] = A.range(Math.ceil(array.length / batchSize)).map(i => []);
        for (let i = 0; i < array.length; i++) {
            result[Math.floor(i / batchSize)].push(array[i]);
        }
        return result;
    }

    export function clone<T>(array: ReadonlyArray<T>) {
        if (isEmpty(array)) return [];
        return Array.from(array);
    }

    export function clone2D<T>(array: T[][]) {
        if (isEmpty(array)) return [];
        return array.map(line => clone(line));
    }

    export function create<T>(count: number, fillFn: (i: number) => T): T[] {
        let result: T[] = [];
        for (let i = 0; i < count; i++) {
            result.push(fillFn(i));
        }
        return result;
    }

    export function emptyArray<T>(count: number) {
        return filledArray<T>(count);
    }

    /**
     * Returns true iff the arrays contain the same elements.
     */
    export function equals(array1: any[] | undefined, array2: any[] | undefined) {
        let size1 = A.size(array1);
        let size2 = A.size(array2);
        if (size1 === 0 && size2 === 0) return true;
        if (size1 !== size2) return false;
        for (let i = 0; i < size1; i++) {
            if (array1![i] !== array2![i]) return false;
        }
        return true;
    }

    export function filledArray<T>(count: number, fillWith?: T): ValueElseUndefined<T>[] {
        return sequence(count, i => fillWith) as any;
    }

    export function filledArray2D<T>(rows: number, cols: number, fillWith?: T): ValueElseUndefined<T>[][] {
        return sequence2D(rows, cols, (i, j) => fillWith) as any;
    }

    export function get2DArrayDimensions(array: any[][]): Dimens {
        if (isEmpty(array)) return { width: 0, height: 0 };
        return { width: M.max(array, line => isEmpty(line) ? 0 : line.length), height: array.length };
    }

    export function isArray(obj: any): obj is any[] {
        return Array.isArray(obj);
    }

    export function isEmpty(array: ReadonlyArray<any> | undefined): array is undefined {
        return !array || array.length === 0;
    }

    export function map2D<T,S>(array: T[][], fn: (a: T) => S) {
        if (isEmpty(array)) return [];
        return array.map(line => isEmpty(line) ? [] : line.map(fn));
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

    /**
     * Moves an element of a list before another element of the list.
     */
    export function moveBefore<T>(list: T[], obj: T, before: T) {
        let obji = list.indexOf(obj);
        let beforei = list.indexOf(before);

        if (obji < 0 || beforei < 0) return;
        if (obji === beforei-1) return;

        if (obji < beforei) {
            list.splice(obji, 1);
            list.splice(beforei-1, 0, obj);
        } else {
            list.splice(obji, 1);
            list.splice(beforei, 0, obj);
        }
    }

    /**
     * Moves an element of a list after another element of the list.
     */
    export function moveAfter<T>(list: T[], obj: T, after: T) {
        let obji = list.indexOf(obj);
        let afteri = list.indexOf(after);

        if (obji < 0 || afteri < 0) return;
        if (obji === afteri+1) return;

        if (obji < afteri) {
            list.splice(obji, 1);
            list.splice(afteri, 0, obj);
        } else {
            list.splice(obji, 1);
            list.splice(afteri+1, 0, obj);
        }
    }

    export function normalize(list: number[]) {
        let s = A.sum(list);
        if (s === 0) return list;
        for (let i = 0; i < list.length; i++) {
            list[i] /= s;
        }
        return list;
    }

    /**
     * Returns true iff the arrays contain a common element.
     */
    export function overlaps(array1: any[], array2: any[]) {
        if (isEmpty(array1) || isEmpty(array2)) return false;
        for (let e of array1){
            if (array2.includes(e)) return true;
        }
        return false;
    }

    /**
     * Pushes an object onto the array in the correct sorted order. Assumes the array is already sorted.
     * If there is a tie, uses the last possible position, similar to a normal push.
     * Returns the new length of the array.
     */
    export function pushSorted<T>(array: T[], obj: T, key: (t: T) => number, reverse: boolean = false) {
        let r = reverse ? -1 : 1;
        let i = array.findIndex(e => r*key(obj) < r*key(e));
        if (i < 0) {
            array.push(obj);
        } else {
            array.splice(i, 0, obj);
        }
        return array.length;
    }

    /**
     * An array of integers from 0 to n-1 or n to m-1, inclusive.
     */
    export function range(n: number, m?: number) {
        if (m === undefined) {
            m = n;
            n = 0;
        }
        if (n === m) return [];
        return sequence(m-n, i => i+n);
    }

    /**
     * An array of integers from n to m, inclusive.
     * Supports cases where n < m, n = m, or n > m.
     */
    export function rangeInclusive(n: number, m: number) {
        if (n >= m) return sequence(n-m+1, i => n-i);
        return sequence(m-n+1, i => i+n);
    }

    /**
     * Removes all occurrences of a value from the array.
     * Returns the number of elements removed.
     */
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
            result.pushAll(array);
        }
        return result;
    }

    /**
     * Creates a new array equal to: [f(0), f(1), f(2), ..., f(count-1)]
     */
    export function sequence<T>(count: number, f: (i: number) => T): T[] {
        let result: T[] = [];
        for (let i = 0; i < count; i++) {
            result.push(f(i));
        }
        return result;
    }

    export function sequence2D<T>(rows: number, cols: number, f: (i: number, j: number) => T): T[][] {
        return sequence(rows, i => sequence(cols, j => f(i, j)));
    }

    export function size(array: any[] | undefined) {
        if (isEmpty(array)) return 0;
        return array.length;
    }

    /**
     * Sorts in ascending order by default.
     */
    export function sort<T>(array: T[], key: (t: T) => number, reverse?: 'reverse') {
        let r = reverse ? -1 : 1;
        return array.sort((a,b) => r*(key(a)-key(b)));
    }

    /**
     * Sorts in ascending order by default.
     */
    export function sorted<T>(array: T[], key: (t: T) => number, reverse?: 'reverse') {
        return A.sort(A.clone(array), key, reverse);
    }

    export function sum<T>(array: T[], key: (e: T) => number = (e => <any>e)) {
        if (isEmpty(array)) return 0;
        let result = 0;
        for (let i = 0; i < array.length; i++) {
            result += key(array[i]);
        }
        return result;
    }

    export function swap<T>(array: T[], i: number, j: number) {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}