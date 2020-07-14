namespace Sound {
    export type Controller = {
        volume: number;
    }
}

class Sound {
    private webAudioSound: WebAudioSoundI;
    private get soundManager() { return global.soundManager; }

    private markedForDisable: boolean;
    get isMarkedForDisable() { return this.markedForDisable; }

    paused: boolean;
    volume: number;
    loop: boolean;

    get done() { return this.webAudioSound.done; }

    pos: number;
    get duration() { return this.webAudioSound.duration; }

    controller: Sound.Controller;

    constructor(key: string, controller?: Sound.Controller) {
        let asset = AssetCache.getSoundAsset(key);
        if (WebAudio.started) {
            this.webAudioSound = new WebAudioSound(asset);
        } else {
            this.webAudioSound = new WebAudioSoundDummy(asset);
        }
        this.webAudioSound.pause();  // Start paused to avoid playing for one frame when not updating
        this.markedForDisable = false;
        this.paused = false;
        this.pos = 0;

        this.volume = 1;
        this.loop = false;

        this.controller = controller;
    }

    markForDisable() {
        this.markedForDisable = true;
    }

    unmarkForDisable() {
        this.markedForDisable = false;
    }

    ensureDisabled() {
        this.webAudioSound.pause();
    }

    ensureEnabled() {
        this.webAudioSound.unpause();
    }

    update(delta: number) {
        this.soundManager.ensureSoundEnabled(this);
        this.pos += delta;
        
        if (WebAudio.started && this.webAudioSound instanceof WebAudioSoundDummy) {
            if (this.pos < this.duration) {
                // Generate WebAudioSound from dummy
                this.webAudioSound = this.webAudioSound.toWebAudioSound();
            }
            this.webAudioSound.seek(this.pos);
        }

        let volume = this.volume * (this.controller ? this.controller.volume : 1);
        if (this.webAudioSound.volume !== volume) this.webAudioSound.volume = volume;

        if (this.webAudioSound.loop !== this.loop) this.webAudioSound.loop = this.loop;
    }
}
