class FPSMetricManager {
    monitor: Monitor;
    timePerReport: number;
    
    private time: number;

    constructor(timePerReport: number) {
        this.monitor = new Monitor();
        this.timePerReport = timePerReport;
        this.time = 0;
    }

    update(delta: number) {
        this.monitor.addPoint(delta);
        this.time += delta;

        if (this.time >= this.timePerReport) {
            this.report();
            this.monitor.clear();
            this.time = 0;
        }
    }

    report() {
        //debug(`avg: ${1/this.monitor.getAvg()}, p50: ${1/this.monitor.getP(50)}`);
    }
}