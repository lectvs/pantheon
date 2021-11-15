class Timer {
    duration: number;
    speed: number;
    time: number;
    paused: boolean;

    callback: () => any;
    currentIter: number;
    count: number;

    get running() { return !this.done && !this.paused; }
    get done() { return this.currentIter >= this.count; }
    get progress() {
        if (this.duration === 0) return 1;
        return Math.min(this.time / this.duration, 1);
    }

    constructor(duration: number, callback?: () => any, count: number = 1) {
        this.duration = duration;
        this.speed = 1;
        this.time = 0;
        this.paused = false;
        this.callback = callback;
        this.count = count;
        this.currentIter = 0;
    }

    update(delta: number) {
        if (this.running) {
            this.time += delta * this.speed;

            if (this.time >= this.duration) {
                if (this.callback) this.callback();
                this.currentIter++;

                if (this.currentIter < this.count) {
                    this.time -= this.duration
                    while (this.time >= this.duration && this.currentIter < this.count) {
                        this.time -= this.duration;
                        if (this.callback) this.callback();
                        this.currentIter++;
                    }
                } else {
                    this.time = this.duration;
                }
            }
        }
    }

    finish() {
        this.time = this.duration;
    }

    reset() {
        this.time = 0;
        this.currentIter = 0;
    }
}