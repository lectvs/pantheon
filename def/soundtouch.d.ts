declare class PitchShifter {
    pitch: number;
    pitchSemitones: number;
    rate: number;
    tempo: number;

    get node(): AudioBufferSourceNode;

    constructor(audioCtx: AudioContext, audioBuffer: AudioBuffer, bufferSize: number, onEnd?: Function);

    connect(destinationNode: AudioNode);

    disconnect();
}