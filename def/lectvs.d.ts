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
     * Clears the array by setting its length to zero.
     */
    clear(): void;

    filterInPlace(predicate: (value: T, index: number, obj: T[]) => boolean): this;

    /**
     * Version of findIndex that returns the last element matching the predicate.
     */
    findIndexLast(predicate: (value: T, index: number, obj: T[]) => unknown): number;

    /**
     * Version of find that returns the last element matching the predicate.
     */
    findLast<S extends T>(predicate: (value: T, index: number, obj: T[]) => value is S): S | undefined;
    findLast(predicate: (value: T, index: number, obj: T[]) => unknown): T | undefined;

    // Overrides to allow for undefined searchElement.
    includes(searchElement: T | undefined | null, fromIndex?: number): boolean;
    indexOf(searchElement: T | undefined | null, fromIndex?: number): number;

    /**
     * Returns the last element of the array, or undefined if the array is empty.
     */
    last(): T | undefined;

    mapInPlace<S>(callbackFn: (value: T, index: number, obj: T[]) => S): S[];

    /**
     * Appends elements from another array to the end of this array, and returns the new length of the array.
     */
    pushAll(other: T[]): number;

    /**
     * Removes the element at the specified index, like splice but does not create a new array.
     */
    removeAt(index: number, removeCount?: number): T;
}

declare namespace PIXI {
    export interface Rectangle {
        // Override for generic rects.
        copyFrom(rect: Rect): this;
    }

    export interface Sprite {
        /**
         * Updates and sets Effects on a sprite. Should be called after setting the sprite's transforms.
         */
        updateAndSetEffects(effects: Effects): void;
    }
}