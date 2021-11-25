class GlobalSoundManager {
    private activeSounds: Sound[];
    private paused: boolean;

    constructor() {
        this.activeSounds = [];
        this.paused = false;
    }

    pause() {
        for (let i = this.activeSounds.length-1; i >= 0; i--) {
            this.ensureSoundDisabled(this.activeSounds[i]);
        }
        this.paused = true;
    }

    unpause() {
        this.paused = false;
    }

    preGameUpdate() {
        for (let sound of this.activeSounds) {
            sound.markForDisable();
        }
    }

    postGameUpdate() {
        for (let i = this.activeSounds.length-1; i >= 0; i--) {
            let sound = this.activeSounds[i];
            if (sound.isMarkedForDisable || this.paused) {
                this.ensureSoundDisabled(sound);
            }
        }
    }

    ensureSoundDisabled(sound: Sound) {
        sound.ensureDisabled();
        A.removeAll(this.activeSounds, sound);
    }

    ensureSoundEnabled(sound: Sound) {
        if (this.paused) return;
        if (!_.contains(this.activeSounds, sound)) {
            this.activeSounds.push(sound);
        }
        sound.unmarkForDisable();
        sound.ensureEnabled();
    }
}