class FireBuffer {
    private readonly bufferAtFull = 20;
    private readonly bufferIncrease = 16;
    private readonly decaySpeed = 4;

    private buffer: number;

    private get baseBuffer() { return this.buffer; }

    constructor() {
        this.buffer = this.bufferAtFull;
    }

    update(delta: number) {
        this.buffer -= this.decaySpeed * delta;
        this.buffer = M.clamp(this.buffer, this.bufferAtFull, Infinity);
    }

    getBuffer() {
        return this.baseBuffer;
    }

    increaseBuffer() {
        this.buffer += this.bufferIncrease;
    }
}