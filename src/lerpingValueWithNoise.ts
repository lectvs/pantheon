class LerpingValueWithNoise {
    private readonly speed: number;
    private readonly noiseFactor: number;
    private readonly noiseIntensity: number;

    private baseValue: number;
    private noise: number;

    goal: number;
    get value() { return this.baseValue + this.noise; }

    constructor(initialValue: number, speed: number, noiseFactor: number, noiseIntensity: number) {
        this.speed = speed;
        this.noiseFactor = noiseFactor;
        this.noiseIntensity = noiseIntensity;
        this.baseValue = initialValue;
        this.goal = initialValue;
        this.noise = 0;
    }

    update(delta: number) {
        if (this.baseValue > this.goal) {
            this.baseValue = Math.max(this.baseValue - this.speed * delta, this.goal);
        } else if (this.baseValue < this.goal) {
            this.baseValue = Math.min(this.baseValue + this.speed * delta, this.goal);
        }

        if (Random.boolean(this.noiseFactor * delta)) {
            this.noise = Random.float(-this.noiseIntensity, this.noiseIntensity);
        }
    }
}