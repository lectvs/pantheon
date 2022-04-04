namespace WebAudioSound {
    export type Asset = {
        buffer: AudioBuffer;
        volume: number;
        speed: number;
    }
}

interface WebAudioSoundI {
    asset: WebAudioSound.Asset;
    volume: number;
    speed: number;
    loop: boolean;
    onDone: () => void;
    duration: number;
    done: boolean;
    paused: boolean;

    pause(): void;
    unpause(): void;
    seek(pos: number): void;
    stop(): void;
}

class WebAudioSound implements WebAudioSoundI{
    asset: WebAudioSound.Asset;
    private sourceNode: AudioBufferSourceNode;

    private get context() { return WebAudio.context; }

    private gainNode: GainNode;
    private _volume: number;
    get volume() {
        return this._volume;
    }
    set volume(value: number) {
        this._volume = this.asset.volume === 0 ? value : M.clamp(value, 0, Sound.MAX_VOLUME / this.asset.volume);
        this.gainNode.gain.value = this._volume * this.asset.volume;
    }

    private _speed: number;
    get speed() {
        return this._speed;
    }
    set speed(value: number) {
        this._speed = this.asset.speed === 0 ? value : M.clamp(value, 0, Sound.MAX_SPEED / this.asset.speed);
        if (this.sourceNode) this.sourceNode.playbackRate.value = this._speed * this.asset.speed;
    }

    private _loop: boolean;
    get loop() { return this._loop; }
    set loop(value: boolean) {
        this._loop = value;
        if (this.sourceNode) this.sourceNode.loop = value;
    }

    get duration() { return this.sourceNode ? this.sourceNode.buffer.duration : 0; }

    private _done: boolean;
    get done() { return this._done; }

    onDone: () => void;

    private startTime: number;
    private pausedPosition: number;
    get paused() { return this.pausedPosition !== undefined; };
    set paused(value: boolean) { value ? this.pause() : this.unpause(); }

    constructor(asset: WebAudioSound.Asset) {
        this.asset = asset;

        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);

        this._volume = 1;
        this._speed = 1;
        this._loop = false;
        this.onDone = Utils.NOOP;

        this.start();
    }

    pause() {
        if (this.paused || this.done) return;
        this.pausedPosition = M.mod(this.context.currentTime - this.startTime, this.duration);
        this.sourceNode.onended = undefined;
        this.sourceNode.stop();
    }

    unpause() {
        if (!this.paused || this.done) return;
        this.start(this.pausedPosition);
    }

    seek(pos: number) {
        if (pos >= this.duration) {
            this.stop();
            return;
        }

        if (this.paused) {
            this.pausedPosition = pos;
        } else {
            this.sourceNode.onended = undefined;
            this.sourceNode.stop();
            this.start(pos);
        }
    }

    stop() {
        this.sourceNode.stop();
    }

    private start(offset: number = 0) {
        this.sourceNode = this.context.createBufferSource();
        this.sourceNode.buffer = this.asset.buffer;
        this.sourceNode.connect(this.gainNode);
        this.sourceNode.onended = () => {
            this._done = true;
            this.onDone();
        }
        this.sourceNode.playbackRate.value = this._speed;
        this.sourceNode.loop = this._loop;
        this.sourceNode.start(0, offset);
        this.startTime = this.context.currentTime - offset;
        this.pausedPosition = undefined;
        this._done = false;
    }
}

class WebAudioSoundDummy implements WebAudioSoundI {
    asset: WebAudioSound.Asset;
    volume: number;
    speed: number;
    loop: boolean;
    onDone: () => void;
    duration: number;
    done: boolean;
    paused: boolean;

    constructor(asset: WebAudioSound.Asset) {
        this.asset = asset;
        this.volume = 1;
        this.speed = 1;
        this.loop = false;
        this.onDone = Utils.NOOP;
        this.duration = asset.buffer.duration;
        this.done = false;
        this.paused = false;
    }

    pause() {
        this.paused = true;
    }

    unpause() {
        this.paused = false;
    }

    seek(pos: number) {
        if (pos >= this.duration) {
            this.stop();
            return;
        }
    }

    stop() {
        this.done = true;
    }

    toWebAudioSound() {
        let sound = new WebAudioSound(this.asset);
        sound.volume = this.volume;
        sound.speed = this.speed;
        sound.loop = this.loop;
        sound.onDone = this.onDone;
        sound.paused = this.paused;
        return sound;
    }
}
