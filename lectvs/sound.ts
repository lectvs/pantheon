class Sound {
    private webAudioSound: WebAudioSoundI;
    private get soundManager() { return global.soundManager; }

    private markedForDisable: boolean;
    get isMarkedForDisable() { return this.markedForDisable; }

    paused: boolean;
    get volume() { return this.webAudioSound.volume; }
    set volume(value: number) { this.webAudioSound.volume = value; }
    get loop() { return this.webAudioSound.loop; }
    set loop(value: boolean) { this.webAudioSound.loop = value; }

    get done() { return this.webAudioSound.done; }

    pos: number;
    get duration() { return this.webAudioSound.duration; }

    constructor(key: string) {
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
                this.webAudioSound = new WebAudioSound(this.webAudioSound.asset);
            }
            this.webAudioSound.seek(this.pos);
        }
    }
}
