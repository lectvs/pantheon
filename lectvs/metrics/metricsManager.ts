namespace MetricsManager {
    export type Config = {
        recordKey: string;
    }
}

class MetricsManager {
    recordKey: string;

    constructor(config: MetricsManager.Config) {
        this.recordKey = config.recordKey;
    }

    update() {
        if (Debug.DEBUG && Input.justDown(this.recordKey)) {
            if (!global.metrics.isRecording) {
                global.metrics.startRecording('recording');
                debug("Started recording");
            } else {
                global.metrics.endRecording();
                debug(`Ended recording (${global.metrics.getLastRecording().time.toFixed(0)} ms)`);
            }
        }
    }
}