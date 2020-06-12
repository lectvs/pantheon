namespace Metrics {
    export type Frame = Dict<number>;
}

class Metrics {
    private frames: Metrics.Frame[];
    private currentFrame: Metrics.Frame;

    private currentStartTimes: Dict<number>;

    constructor() {
        this.frames = [];
        this.currentStartTimes = {};
    }

    startFrame() {
        this.currentFrame = {};
        this.startTime('time');
    }

    endFrame() {
        this.endTime('time');
        this.frames.push(this.currentFrame);
        this.currentFrame = null;
    }

    getCurrentFrameMetric(metric: string) {
        return this.currentFrame[metric];
    }

    getCurrentFrameWorldObjectMetric(worldObject: WorldObject, metric: string) {
        return this.getCurrentFrameMetric(`${worldObject.uid}.${metric}`);
    }

    setMetric(metric: string, value: number) {
        this.currentFrame[metric] = value;
    }

    setWorldObjectMetric(worldObject: WorldObject, metric: string, value: number) {
        this.setMetric(`${worldObject.uid}.${metric}`, value);
    }

    startTime(metric: string) {
        if (metric in this.currentStartTimes) {
            debug(`Metric ${metric} has started twice. Ignoring second start.`);
            return;
        }
        this.currentStartTimes[metric] = this.getCurrentTime();
    }

    startWorldObjectTime(worldObject: WorldObject, metric: string) {
        this.startTime(`${worldObject.uid}.${metric}`);
    }

    endTime(metric: string) {
        if (!(metric in this.currentStartTimes)) {
            debug(`Metric ${metric} has ended without starting. Ignoring.`);
            return;
        }
        this.setMetric(metric, (this.getCurrentTime() - this.currentStartTimes[metric])/1000);
        delete this.currentStartTimes[metric];
    }

    endWorldObjectTime(worldObject: WorldObject, metric: string) {
        this.endTime(`${worldObject.uid}.${metric}`);
    }

    private getCurrentTime() {
        return performance.now();
    }
}
