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
     * Random float between {min} and {max}.
     * @param min Default: 0
     * @param max Default: 1
     */
    float(min: number = 0, max: number = 1) {
        return min + (max - min) * this.value;
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
     * Random point uniformly in a unit circle.
     * @param radius Default: 1
     */
    inCircle(radius: number = 1): Pt {
        let angle = this.float(0, 2*Math.PI);
        let r = radius * Math.sqrt(this.value);
        return { x: r*Math.cos(angle), y: r*Math.sin(angle) };
    }

    /**
     * Sets the seed of the random number generator.
     * @param seed
     */
    seed(seed: any) {
        // @ts-ignore
        this.generate = new Math.seedrandom(seed);
    }
}

const Random = new RandomNumberGenerator();