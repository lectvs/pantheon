class Timer {
    duration: number;
    speed: number;
    time: number;
    paused: boolean;

    callback: () => any;
    repeat: boolean;

    get running() { return !this.done && !this.paused; }
    get done() { return !this.repeat && this.progress >= 1; }
    get progress() {
        if (this.duration === 0) return 1;
        return Math.min(this.time / this.duration, 1);
    }

    constructor(duration: number, callback?: () => any, repeat: boolean = false) {
        this.duration = duration;
        this.speed = 1;
        this.time = 0;
        this.paused = false;
        this.callback = callback;
        this.repeat = repeat;
    }

    update(delta: number) {
        if (this.running) {
            this.time += delta * this.speed;

            if (this.time >= this.duration) {
                if (this.repeat) {
                    while (this.time >= this.duration) {
                        this.time -= this.duration;
                        if (this.callback) this.callback();
                    }
                } else {
                    this.time = this.duration;
                    if (this.callback) this.callback();
                }
            }
        }
    }

    finish() {
        this.time = this.duration;
    }

    reset() {
        this.time = 0;
    }
}