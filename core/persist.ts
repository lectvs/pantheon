class Persist {
    private static doPersist: () => void;
    private static timer: Timer;

    static init(intervalSeconds: number, doPersist: () => void) {
        this.doPersist = doPersist;
        this.timer = new Timer(intervalSeconds, () => this.persist(), Infinity);
    }

    static persist() {
        this.doPersist();
        this.timer.reset();
    }

    static update(delta: number) {
        this.timer.update(delta);
    }
}