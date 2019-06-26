class Timer {
    duration: number;
    speed: number;
    time: number;

    callback: () => any;
    repeat: boolean;

    done: boolean;

    get progress() {
        if (this.repeat) return 0;
        return this.time / this.duration;
    }

    constructor(duration: number, callback?: () => any, repeat: boolean = false) {
        this.duration = duration;
        this.speed = 1;
        this.time = 0;
        this.done = false;
        this.callback = callback;
        this.repeat = repeat;
    }

    update(delta: number) {
        if (!this.done) {
            this.time += delta;

            while (this.time >= this.duration) {
                if (this.callback) this.callback();
                this.time -= this.duration;
                this.done = !this.repeat;
            }
        }
    }

    reset() {
        this.time = 0;
        this.done = false;
    }
}