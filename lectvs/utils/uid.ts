/// <reference path="random.ts" />

class UIDGenerator {
    private rng: RandomNumberGenerator;
    private tick: number;

    constructor() {
        this.rng = new RandomNumberGenerator();
        this.tick = 0;
    }

    generate() {
        this.rng.seed(this.tick);
        this.tick++;
        return this.generateUid();
    }

    private generateUid() {
        let result = '';
        for (let i = 0; i < UIDGenerator.UID_LENGTH; i++) {
            result += this.rng.element(UIDGenerator.VALID_CHARS);
        }
        return result;
    }

    private static readonly UID_LENGTH = 8;
    private static readonly VALID_CHARS = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
        'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
        'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7',
        '8', '9'
    ];
}