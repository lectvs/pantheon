/// <reference path="./monitor.ts"/>

class FPSCalculator {
    monitor: Monitor;
    timePerReport: number;

    fpsAvg: number;
    fpsP: number;

    private startFrameTime: number;
    private totalTime: number;

    constructor(timePerReport: number) {
        this.monitor = new Monitor();
        this.timePerReport = timePerReport;
        this.fpsAvg = 0;
        this.fpsP = 0;
        this.startFrameTime = 0;
        this.totalTime = 0;
    }

    update() {
        let currentTime = performance.now();
        let delta = (currentTime - this.startFrameTime)/1000;

        this.monitor.addPoint(delta);
        this.totalTime += delta;

        if (this.totalTime >= this.timePerReport) {
            this.fpsAvg = 1/this.monitor.getAvg();
            this.fpsP = 1/this.monitor.getP(95);
            this.monitor.clear();
            this.totalTime = 0;
        }

        this.startFrameTime = currentTime;
    }
}