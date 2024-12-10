/// <reference path="./sound.ts" />

class BasicSound extends Sound {
    private webAudioSound: WebAudioSoundI;
    private get soundManager() { return global.soundManager; }

    get done() { return this.webAudioSound.done; }
    
    get onDone() { return this.webAudioSound.onDone; }
    set onDone(value) { this.webAudioSound.onDone = value; }

    get duration() { return this.webAudioSound.duration; }

    constructor(key: string, controller?: Sound.Controller) {
        super(key, controller);

        let asset = AssetCache.getSoundAsset(key);
        if (WebAudio.started) {
            this.webAudioSound = new WebAudioSound(asset);
        } else {
            this.webAudioSound = new WebAudioSoundDummy(asset);
        }
        this.webAudioSound.pause();  // Start paused to avoid playing for one frame when not updating
    }

    update(delta: number) {
        this.soundManager.ensureSoundEnabled(this);
        this.pos += delta;

        if (this.pos > this.duration) {
            this.pos = M.mod(this.pos, this.duration);
            if (this.loopsLeft > 0) this.loopsLeft--;
        }

        if (this.hanging) {
            this.seek(this.pos - delta);
        }
        
        if (WebAudio.started && this.webAudioSound instanceof WebAudioSoundDummy) {
            if (this.pos < this.duration || this.loopsLeft > 0) {
                // Generate WebAudioSound from dummy
                this.webAudioSound = this.webAudioSound.toWebAudioSound();
            }
            this.seek(this.pos);
        }

        this.volume = M.clamp(this.volume, 0, Sound.MAX_VOLUME);
        this.speed = M.clamp(this.speed, 0, Sound.MAX_SPEED);

        let volume = this.volume * Sound.getControllerVolume(this.controller);
        if (this.webAudioSound.volume !== volume) this.webAudioSound.volume = volume;

        if (this.webAudioSound.speed !== this.speed) this.webAudioSound.speed = this.speed;

        let loop = this.loopsLeft > 0;
        if (this.webAudioSound.loop !== loop) this.webAudioSound.loop = loop;
    }

    ensureDisabled() {
        this.webAudioSound.pause();
    }

    ensureEnabled() {
        this.webAudioSound.unpause();
    }

    seek(position: number) {
        this.pos = position;
        if (this.loopsLeft > 0) {
            this.pos = M.mod(this.pos, this.duration);
        }
        this.webAudioSound.seek(this.pos);
    }

    stop() {
        this.hanging = false;
        this.webAudioSound.stop();
    }

    setFilter(filter: WebAudioFilter) {
        this.webAudioSound.setFilter(filter);
    }
}