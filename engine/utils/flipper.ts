class Flipper {
    constructor(private onTrue: () => void, private onFalse: () => void, private value: boolean = false) {
    }

    update(value: boolean) {
        if (value && !this.value) {
            this.onTrue();
        }
        if (!value && this.value) {
            this.onFalse();
        }
        this.value = value;
    }
}