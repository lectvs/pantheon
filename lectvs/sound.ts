namespace Sound {
    export type Asset = {
        buffer: AudioBuffer;
    }
}

class Sound {
    private asset: Sound.Asset;
    private type: Sound.Type;
    private webAudioSound: AudioBufferSourceNode;

    private get context() { return this.type === Sound.Type.WORLD ? WebAudio.worldContext : WebAudio.globalContext; }

    private _done: boolean;
    get done() { return this._done; }

    private startTime: number;
    private pausedPosition: number;
    get paused() { return this.pausedPosition !== undefined; };
    set paused(value: boolean) { value ? this.pause() : this.unpause(); }

    private preWebAudioStartStartTime: number;

    constructor(asset: Sound.Asset, type: Sound.Type = Sound.Type.GLOBAL) {
        this.asset = asset;
        this.type = type;
        this._done = false;
        this.pausedPosition = undefined;
        if (!WebAudio.started) this.preWebAudioStartStartTime = performance.now();

        this.start();
    }

    pause() {
        this.pausedPosition = this.context.currentTime - this.startTime;
        this.webAudioSound.onended = undefined;
        this.stop();
        debug(this.pausedPosition);
    }

    unpause() {
        this.start(this.pausedPosition);
    }

    onWebAudioStart() {
        let pos = (performance.now() - this.preWebAudioStartStartTime)/1000;
        
        if (this.paused) {
            this.pausedPosition += pos;
        } else {
            this.pause();
            this.pausedPosition += pos;
            this.unpause();
        }
    }

    private start(offset: number = 0) {
        this.webAudioSound = this.context.createBufferSource();
        this.webAudioSound.buffer = this.asset.buffer;
        this.webAudioSound.connect(this.context.destination);
        this.webAudioSound.onended = () => {
            this._done = true;
        }
        this.webAudioSound.start(0, offset);
        this.startTime = this.context.currentTime - offset;
        this.pausedPosition = undefined;
    }

    private stop() {
        if (this.webAudioSound) {
            this.webAudioSound.stop();
        }
    }
}

namespace Sound {
    export enum Type {
        GLOBAL,
        WORLD, // Uses "world" AudioContext which is paused on game pause
    }
}
