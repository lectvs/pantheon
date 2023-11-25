/**
 * The game's code name, defined in index.html.
 */
declare var GAME_NAME: string;

/**
 * true iff we are on a mobile browser, or explicitly set.
 */
declare var IS_MOBILE: boolean;

/**
 * global.gameWidth
 */
declare const W: number;

/**
 * global.gameHeight
 */
declare const H: number;

/**
 * global.gameWidth/2
 */
declare const HW: number;

/**
 * global.gameHeight/2
 */
declare const HH: number;

interface Array<T> {
    /**
     * Version of findIndex that returns the last element matching the predicate.
     */
    findIndexLast(predicate: (value: T, index: number, obj: T[]) => unknown): number;

    /**
     * Version of find that returns the last element matching the predicate.
     */
    findLast<S extends T>(predicate: (value: T, index: number, obj: T[]) => value is S): S | undefined;
    findLast(predicate: (value: T, index: number, obj: T[]) => unknown): T | undefined;

    /**
     * Returns the last element of the array, or undefined if the array is empty.
     */
    last(): T | undefined;

    // Overrides to allow for undefined searchElement.
    includes(searchElement: T | undefined | null, fromIndex?: number): boolean;
    indexOf(searchElement: T | undefined | null, fromIndex?: number): number;
}