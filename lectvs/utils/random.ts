class RandomNumberGenerator {
    private generate: () => number;

    constructor(seed?: number) {
        this.seed(seed);
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
        if (_.isEmpty(array)) return undefined;
        return array[this.index(array)];
    }

    /**
     * Random point uniformly in a unit circle.
     * @param radius Default: 1
     */
    inCircle(radius: number = 1): Pt {
        let angle = this.float(0, 2*Math.PI);
        let r = radius * Math.sqrt(this.value);
        return { x: r*Math.cos(angle), y: r*Math.sin(angle) };
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
     * Random point on a unit circle.
     * @param radius Default: 1
     */
    onCircle(radius: number = 1): Pt {
        let angle = this.float(0, 2*Math.PI);
        return { x: radius*Math.cos(angle), y: radius*Math.sin(angle) };
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