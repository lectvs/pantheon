/**
 * Simulates a keyboard repeat but for generic boolean values.
 */
class AutoRepeat {
    private holdTime: number;
    private value: boolean;

    constructor(public initialDelay: number, public repeatDelay: number, public activateOnFirstSignal: boolean = true) {
        this.holdTime = 0;
        this.value = false;
    }

    update(value: boolean, delta: number) {
        if (value) {
            this.holdTime += delta;
        } else {
            this.holdTime = 0;
        }
        this.value = this.getValue(delta);
    }

    get() {
        return this.value;
    }

    private getValue(delta: number) {
        if (this.activateOnFirstSignal && delta !== 0 && this.holdTime === delta) return true;
        if (this.holdTime < this.initialDelay) return false;
        return M.everyNFloat(this.repeatDelay, this.holdTime - this.initialDelay, delta);
    }
}