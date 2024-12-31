class DecayingTimer extends Timer {
    state: 'charging' | 'decaying';

    constructor(duration: number, callback: () => void) {
        super(duration, callback, Infinity);

        this.state = 'decaying';
    }

    override update(delta: number): void {
        if (!this.running) return;
        
        if (this.state === 'charging') {
            super.update(delta);
        } else {
            this.time -= delta * this.speed;

            if (this.time < 0) {
                this.time = 0;
            }
        }
    }
}