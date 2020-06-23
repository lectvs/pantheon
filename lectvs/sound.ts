class Sound {
    private webAudioSound: WebAudioSound;
    private get soundManager() { return global.soundManager; }

    private markedForDisable: boolean;
    get isMarkedForDisable() { return this.markedForDisable; }

    paused: boolean;
    get volume() { return this.webAudioSound.volume; }
    set volume(value: number) { this.webAudioSound.volume = value; }
    get loop() { return this.webAudioSound.loop; }
    set loop(value: boolean) { this.webAudioSound.loop = value; }

    get done() { return this.webAudioSound.done; }

    constructor(key: string) {
        this.webAudioSound = new WebAudioSound(AssetCache.getSoundAsset(key));
        this.webAudioSound.pause();  // Start paused to avoid playing for one frame when not updating
        this.markedForDisable = false;
        this.paused = false;
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
    }

    // TODO: get rid of this
    onWebAudioStart() {
        this.webAudioSound.onWebAudioStart();
    }
}
