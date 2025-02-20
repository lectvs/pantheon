class Experiment {
    private toggleKey: string;
    private enabled: boolean;

    constructor(toggleKey: string) {
        this.toggleKey = toggleKey;
        this.enabled = false;
    }

    update(name: string) {
        if (Input.justDown(this.toggleKey)) {
            this.enabled = !this.enabled;
            debug(`Experiment '${name}' turned ${this.enabled ? 'on' : 'off'}`);
        }
    }

    isEnabled() {
        return Debug.DEBUG && this.enabled;
    }
}