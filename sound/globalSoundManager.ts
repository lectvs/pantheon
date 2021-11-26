class GlobalSoundManager {
    private activeSounds: Sound[];
    private paused: boolean;

    constructor() {
        this.activeSounds = [];
        this.paused = false;
    }

    pause() {
        for (let i = this.activeSounds.length-1; i >= 0; i--) {
            let r = this.ensureSoundDisabled(this.activeSounds[i]);
            i -= r-1;
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
                let r = this.ensureSoundDisabled(sound);
                i -= r-1;
            }
        }
    }

    ensureSoundDisabled(sound: Sound) {
        sound.ensureDisabled();
        return A.removeAll(this.activeSounds, sound);
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