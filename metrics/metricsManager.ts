class MetricsManager {
    update() {
        if (Debug.DEBUG && Input.justDown(Input.DEBUG_RECORD_METRICS)) {
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