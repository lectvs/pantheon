namespace Sound {
    export type Controller = SoundManager | MusicManager;
}

class Sound {
    private webAudioSound: WebAudioSoundI;
    private get soundManager() { return global.soundManager; }

    private markedForDisable: boolean;
    get isMarkedForDisable() { return this.markedForDisable; }

    key: string;

    paused: boolean;
    /** Must be between 0 and Sound.MAX_VOLUME */
    volume: number;
    /** Must be between 0 and Sound.MAX_SPEED */
    speed: number;
    loop: boolean;

    get done() { return this.webAudioSound.done; }
    
    get onDone() { return this.webAudioSound.onDone; }
    set onDone(value) { this.webAudioSound.onDone = value; }

    private pos: number;
    get position() { return this.pos; }
    get duration() { return this.webAudioSound.duration; }

    controller: Sound.Controller;
    private hanging: boolean;

    constructor(key: string, controller?: Sound.Controller) {
        let asset = AssetCache.getSoundAsset(key);
        if (WebAudio.started) {
            this.webAudioSound = new WebAudioSound(asset);
        } else {
            this.webAudioSound = new WebAudioSoundDummy(asset);
        }
        this.webAudioSound.pause();  // Start paused to avoid playing for one frame when not updating
        this.markedForDisable = false;
        this.key = key;
        this.paused = false;
        this.pos = 0;

        this.volume = 1;
        this.speed = 1;
        this.loop = false;
        this.hanging = false;

        this.controller = controller;
    }

    update(delta: number) {
        this.soundManager.ensureSoundEnabled(this);
        this.pos += delta;

        if (this.hanging) {
            this.pos -= delta;
            this.webAudioSound.seek(this.loop ? M.mod(this.pos, this.duration) : this.pos);
        }
        
        if (WebAudio.started && this.webAudioSound instanceof WebAudioSoundDummy) {
            if (this.pos < this.duration || this.loop) {
                // Generate WebAudioSound from dummy
                this.webAudioSound = this.webAudioSound.toWebAudioSound();
            }
            this.webAudioSound.seek(this.loop ? M.mod(this.pos, this.duration) : this.pos);
        }

        this.volume = M.clamp(this.volume, 0, Sound.MAX_VOLUME);
        this.speed = M.clamp(this.speed, 0, Sound.MAX_SPEED);

        let volume = this.volume * (this.controller ? this.controller.volume : 1);
        if (this.webAudioSound.volume !== volume) this.webAudioSound.volume = volume;

        if (this.webAudioSound.speed !== this.speed) this.webAudioSound.speed = this.speed;
        if (this.webAudioSound.loop !== this.loop) this.webAudioSound.loop = this.loop;
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

    hang() {
        this.hanging = true;
    }

    seek(position: number) {
        this.pos = position;
        if (this.loop) {
            this.pos = M.mod(this.pos, this.duration);
        }
        this.webAudioSound.seek(this.pos);
    }

    stop() {
        this.hanging = false;
        this.webAudioSound.stop();
    }

    humanize(percent: number = 0.05) {
        this.speed *= Random.float(1 - percent, 1 + percent);
    }

    setFilter(filter: WebAudioFilter) {
        this.webAudioSound.setFilter(filter);
    }
}

namespace Sound {
    export const MAX_VOLUME: number = 2;
    export const MAX_SPEED: number = 100;
}