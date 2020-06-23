namespace WebAudioSound {
    export type Asset = {
        buffer: AudioBuffer;
    }
}

class WebAudioSound {
    private asset: WebAudioSound.Asset;
    private webAudioSound: AudioBufferSourceNode;

    private get context() { return WebAudio.context; }

    private gainNode: GainNode;
    get volume() { return this.gainNode.gain.value; }
    set volume(value: number) { this.gainNode.gain.value = value; }

    private _speed: number;
    get speed() {
        return this.webAudioSound ? this.webAudioSound.playbackRate.value : this._speed;
    }
    set speed(value: number) {
        this._speed = value;
        if (this.webAudioSound) this.webAudioSound.playbackRate.value = value;
    }

    private _loop: boolean;
    get loop() { return this.webAudioSound ? this.webAudioSound.loop : this._loop; }
    set loop(value: boolean) {
        this._loop = value;
        if (this.webAudioSound) this.webAudioSound.loop = value;
    }

    private _done: boolean;
    get done() { return this._done; }

    private startTime: number;
    private pausedPosition: number;
    get paused() { return this.pausedPosition !== undefined; };
    set paused(value: boolean) { value ? this.pause() : this.unpause(); }

    private preWebAudioStartStartTime: number;

    constructor(asset: WebAudioSound.Asset) {
        this.asset = asset;
        if (!WebAudio.started) this.preWebAudioStartStartTime = performance.now();

        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);

        this._speed = 1;
        this._loop = false;

        this.start();
    }

    pause() {
        if (this.paused) return;
        this.pausedPosition = this.context.currentTime - this.startTime;
        this.webAudioSound.onended = undefined;
        this.webAudioSound.stop();
    }

    unpause() {
        if (!this.paused || this.done) return;
        this.start(this.pausedPosition);
    }

    onWebAudioStart() {
        let pos = (performance.now() - this.preWebAudioStartStartTime)/1000;
        
        if (!this.paused) {
            this.pausedPosition = this.context.currentTime - this.startTime + pos;
            this.webAudioSound.onended = undefined;
            this.webAudioSound.stop();
            this.start(this.pausedPosition);
        }
    }

    private start(offset: number = 0) {
        this.webAudioSound = this.context.createBufferSource();
        this.webAudioSound.buffer = this.asset.buffer;
        this.webAudioSound.connect(this.gainNode);
        this.webAudioSound.onended = () => {
            this._done = true;
        }
        this.webAudioSound.playbackRate.value = this._speed;
        this.webAudioSound.loop = this._loop;
        this.webAudioSound.start(0, offset);
        this.startTime = this.context.currentTime - offset;
        this.pausedPosition = undefined;
        this._done = false;
    }
}
