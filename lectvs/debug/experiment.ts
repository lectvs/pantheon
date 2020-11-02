class Experiment {
    private toggleKey: string;
    private enabled: boolean;

    constructor(toggleKey: string) {
        this.toggleKey = toggleKey;
        this.enabled = false;
    }

    update() {
        if (Input.justDown(this.toggleKey)) {
            this.enabled = !this.enabled;
        }
    }

    isEnabled() {
        return Debug.DEBUG && this.enabled;
    }
}