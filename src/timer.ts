class Timer {
    duration: number;
    speed: number;
    time: number;

    callback: () => any;
    repeat: boolean;

    get done() { return !this.repeat && this.progress >= 1; }
    get progress() {
        return Math.min(this.time / this.duration, 1);
    }

    constructor(duration: number, callback?: () => any, repeat: boolean = false) {
        this.duration = duration;
        this.speed = 1;
        this.time = 0;
        this.callback = callback;
        this.repeat = repeat;
    }

    update() {
        if (!this.done) {
            this.time += global.delta;

            if (this.time >= this.duration) {
                if (this.callback) this.callback();
                if (this.repeat) {
                    while (this.time >= this.duration) {
                        this.time -= this.duration;
                    }
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