namespace Sound {
    export type Controller = SoundManager | MusicManager | World | WorldObject | Module<WorldObject>;
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
    loopsLeft: number;

    get done() { return this.webAudioSound.done; }
    
    get onDone() { return this.webAudioSound.onDone; }
    set onDone(value) { this.webAudioSound.onDone = value; }

    private pos: number;
    get position() { return this.pos; }
    get duration() { return this.webAudioSound.duration; }

    controller?: Sound.Controller;
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
        this.loopsLeft = 0;
        this.hanging = false;

        this.controller = controller;
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

        let volume = this.volume * this.getControllerVolume();
        if (this.webAudioSound.volume !== volume) this.webAudioSound.volume = volume;

        if (this.webAudioSound.speed !== this.speed) this.webAudioSound.speed = this.speed;

        let loop = this.loopsLeft > 0;
        if (this.webAudioSound.loop !== loop) this.webAudioSound.loop = loop;
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
        if (this.loopsLeft > 0) {
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

    private getControllerVolume() {
        if (this.controller instanceof SoundManager) return this.controller.volume;
        if (this.controller instanceof MusicManager) return this.controller.volume;
        if (this.controller instanceof World) return this.controller.soundManager.volume;
        if (this.controller instanceof WorldObject && this.controller.world) return this.controller.world.soundManager.volume;
        if (this.controller instanceof Module && this.controller.worldObject && this.controller.worldObject.world) return this.controller.worldObject.world.soundManager.volume;
        return 1;
    }
}

namespace Sound {
    export const MAX_VOLUME: number = 2;
    export const MAX_SPEED: number = 100;
}