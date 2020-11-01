namespace Metrics {
    export type Span = {
        name: string;
        start: number;
        end: number;
        time: number;
        // To be uncommented when a use case is found.
        //metrics: Dict<number>;
        subspans?: Span[];
    }
}

class Metrics {
    private recordings: Metrics.Span[];
    private spanStack: Metrics.Span[];
    
    get isRecording() { return !_.isEmpty(this.spanStack); }
    private get currentRecording() { return this.spanStack[0]; }
    private get currentSpan() { return _.last(this.spanStack); }

    constructor() {
        this.reset();
    }

    reset() {
        this.recordings = [];
        this.spanStack = [];
    }

    startRecording(recordingName: string) {
        if (this.isRecording) {
            error(`Tried to start recording ${name} when recording ${this.currentRecording.name} was already started.`);
            return;
        }
        this.startSpan(recordingName, true);
    }

    endRecording() {
        if (!this.isRecording) {
            error(`Tried to end recording ${name} but no recording was happening.`);
            return;
        }
        this.recordings.push(this.currentRecording);
        this.endSpan(this.currentRecording.name, true);
    }

    startSpan(name: string | WorldObject, force: boolean = false) {
        if (!this.isRecording && !force) return;
        if (name instanceof WorldObject) {
            name = this.getWorldObjectSpanName(name);
        }
        let span: Metrics.Span = {
            name: name,
            start: this.getCurrentTimeMilliseconds(),
            end: undefined,
            time: undefined,
            //metrics: {},
            subspans: [],
        };

        if (this.currentSpan) {
            this.currentSpan.subspans.push(span);
        }
        this.spanStack.push(span);
    }

    endSpan(name: string | WorldObject, force: boolean = false) {
        if (!this.isRecording && !force) return;
        if (name instanceof WorldObject) {
            name = this.getWorldObjectSpanName(name);
        }
        if (!this.currentSpan) {
            error(`Tried to end span ${name} but there was no span to end! Span stack:`, this.spanStack);
            return;
        }
        if (this.currentSpan.name !== name) {
            error(`Tried to end span ${name} but the current span is named ${this.currentSpan.name}! Span stack:`, this.spanStack);
            return;
        }
        this.currentSpan.end = this.getCurrentTimeMilliseconds();
        this.currentSpan.time = this.currentSpan.end - this.currentSpan.start;
        this.spanStack.pop();
    }

    recordMetric(metric: string, value: number) {
        //this.currentSpan.metrics[metric] = value;
        error("Metrics have not been implemented yet! Uncomment the lines in metrics.ts");
    }

    getLastRecording() {
        return _.last(this.recordings);
    }

    getReportForLastRecording() {
        return MetricsReport.generateTimeReportForSpan(this.getLastRecording());
    }

    plotLastRecording(width: number = global.gameWidth, height: number = global.gameHeight) {
        return MetricsPlot.plotRecording(this.getLastRecording(), width, height);
    }

    private getCurrentTimeMilliseconds() {
        return performance.now();
    }

    private getWorldObjectSpanName(worldObject: WorldObject) {
        if (worldObject.name) {
            return `${worldObject.name}.${worldObject.constructor.name}.${worldObject.uid}`;
        }
        return `${worldObject.constructor.name}.${worldObject.uid}`;
    }
}
