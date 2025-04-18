/// <reference path="./perlin.ts" />

class RandomNumberGenerator {
    private generate!: () => number;
    private perlinRng: Perlin;

    constructor(seed?: number | string) {
        this.seed(seed);
        this.perlinRng = new Perlin();
    }

    /**
     * Random float between 0 and 1.
     */
    get value(): number {
        return this.generate();
    }

    /**
     * Random angle from 0 to 360.
     */
    angle() {
        return this.float(0, 360);
    }

    /**
     * Random boolean, true or false.
     * @param trueChance Default: 0.5
     */
    boolean(trueChance: number = 0.5) {
        return this.value < trueChance;
    }

    /**
     * Random color from 0x000000 to 0xFFFFFF.
     */
    color() {
        return this.int(0x000000, 0xFFFFFF);
    }

    /**
     * Random float between {min} and {max}.
     * @param min Default: 0
     * @param max Default: 1
     */
    float(min: number = 0, max: number = 1) {
        return min + (max - min) * this.value;
    }

    /**
     * Random element from array, uniformly.
     */
    element<T>(array: T[]) {
        if (A.isEmpty(array)) return undefined;
        return array[this.index(array)];
    }

    /**
     * Random element from array, weighted by a given weights array.
     */
    elementWeighted<T>(array: T[], weights: number[]): T;
    elementWeighted<T>(array: T[], weights: (e: T) => number): T;
    elementWeighted<T>(array: T[], weights: number[] | ((e: T) => number)) {
        if (A.isEmpty(array)) return undefined;
        if (!A.isArray(weights)) {
            let calculatedWeights: number[] = FrameCache.array();
            for (let e of array) {
                calculatedWeights.push(weights(e));
            }
            weights = calculatedWeights;
        }
        if (A.size(weights) !== array.length) {
            console.error(`Weights length does not match array length:`, array, weights);
        }
        let weightSum = A.sum(weights);
        let value = this.float(0, weightSum);
        for (let i = 0; i < array.length; i++) {
            if (value < weights[i]) return array[i];
            value -= weights[i];
        }
        return array.last();
    }

    /**
     * Random Vector2 uniformly in a unit circle.
     * @param radius Default: 1
     */
    inCircle(radius: number = 1) {
        let angle = this.float(0, 360);
        let r = radius * Math.sqrt(this.value);
        return new Vector2(r*M.cos(angle), r*M.sin(angle));
    }

    /**
     * Random Vector2 uniformly in a disc.
     */
    inDisc(radiusSmall: number, radiusLarge: number) {
        let angle = this.float(0, 360);
        let r = radiusLarge * Math.sqrt(this.float(radiusSmall/radiusLarge, 1));
        return new Vector2(r*M.cos(angle), r*M.sin(angle));
    }

    /**
     * Random int from {0} to {array.length - 1}.
     */
    index(array: any[]) {
        return this.int(0, array.length-1);
    }

    /**
     * Random int between {min} and {max}, inclusive.
     */
    int(min: number, max: number) {
        return Math.floor(this.float(min, max+1));
    }

    /**
     * Random Vector2 on a unit circle.
     * @param radius Default: 1
     */
    onCircle(radius: number = 1) {
        let angle = this.float(0, 360);
        return new Vector2(radius*M.cos(angle), radius*M.sin(angle));
    }

    /**
     * Perlin value, normalized to [-1, 1].
     */
    perlin(x: number, y?: number, z?: number) {
        return this.perlinRng.get(x, y, z);
    }

    /**
     * Same as perlin(), with a pre-defined offset.
     */
    perlin2(x: number, y?: number, z?: number) {
        return this.perlinRng.get(x + 11037.11037, y, z);
    }

    /**
     * Random sample of {count} elements from an array.
     */
    sample<T>(array: T[], count: number) {
        if (count > A.size(array)) {
            console.error('Trying to sample an array for more elements than it contains', array, count);
            count = A.size(array);
        }
        if (A.isEmpty(array)) return [];

        let copiedArray = A.clone(array);
        let result: T[] = [];
        for (let i = 0; i < count; i++) {
            let j = this.int(0, copiedArray.length-1);
            result.push(copiedArray.splice(j, 1)[0]);
        }

        return result;
    }

    /**
     * Random sample of {count} elements from an array.
     */
    sampleWeighted<T>(array: T[], weights: number[], count: number) {
        if (count > A.size(array)) {
            console.error('Trying to sample an array for more elements than it contains', array, count);
            count = A.size(array);
        }
        if (A.isEmpty(array)) return [];

        let copiedWeights = A.clone(weights);
        let indices = A.indices(array);
        let result: T[] = [];
        for (let i = 0; i < count; i++) {
            let index = this.elementWeighted(indices, copiedWeights);
            let indexI = indices.indexOf(index);
            indices.splice(indexI, 1);
            copiedWeights.splice(indexI, 1);
            result.push(array[index!]);
        }

        return result;
    }

    /**
     * Shuffles an array in place using the Fischer-Yates shuffle.
     * See https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
     */
    shuffle<T>(array: T[]) {
        if (A.isEmpty(array)) return array;
        for (let i = 0; i < array.length-1; i++) {
            let j = this.int(i, array.length-1);
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    /**
     * Returns a new array using the elements of the input array shuffled using the Fischer-Yates shuffle.
     * See https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
     */
    shuffled<T>(array: T[]): T[] {
        let result = A.clone(array);
        this.shuffle(result);
        return result;
    }

    /**
     * Random sign, -1 or +1.
     */
    sign() {
        return this.value < 0.5 ? -1 : 1;
    }

    /**
     * Sets the seed of the random number generator.
     * @param seed
     */
    seed(seed: any) {
        // seeded random generator from seedrandom.min.js
        // @ts-ignore
        this.generate = new Math.seedrandom(seed);
    }
}

const Random = new RandomNumberGenerator();