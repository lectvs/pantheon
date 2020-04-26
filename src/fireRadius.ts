class FireRadius {
    private readonly fullTime = 60;
    private readonly radiusAtFullTime = 200;
    private readonly timeGainedOnLogConsumptionAtZero = 25;
    private readonly timeGainedOnLogConsumptionAtFull = 10;

    private timer: Timer;

    private get baseRadius() { return this.radiusAtFullTime * (1 - this.timer.progress); }

    constructor() {
        this.timer = new Timer(this.fullTime);
        this.timer.time = this.fullTime/2;
        this.timer.paused = true;
    }

    update(delta: number) {
        this.timer.update(delta);
    }

    getRadius() {
        return this.baseRadius;
    }

    getRadiusPercent() {
        return this.getRadius() / this.radiusAtFullTime;
    }

    increaseTime() {
        let timeGainedOnLogConsumption = M.lerp(this.timeGainedOnLogConsumptionAtFull, this.timeGainedOnLogConsumptionAtZero, this.timer.progress);
        this.timer.time -= timeGainedOnLogConsumption;
    }

    startBurn() {
        this.timer.paused = false;
    }

    stopBurn() {
        this.timer.paused = true;
    }

    win() {
        this.timer.paused = false;
        this.timer.speed = -200;
    }
}