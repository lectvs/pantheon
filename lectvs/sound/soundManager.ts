class SoundManager {
    private activeSounds: Sound[];

    constructor() {
        this.activeSounds = [];
    }

    preGameUpdate() {
        for (let sound of this.activeSounds) {
            sound.markForDisable();
        }
    }

    postGameUpdate() {
        for (let sound of this.activeSounds) {
            if (sound.isMarkedForDisable) {
                this.ensureSoundDisabled(sound);
            }
        }
    }

    ensureSoundDisabled(sound: Sound) {
        sound.ensureDisabled();
        A.removeAll(this.activeSounds, sound);
    }

    ensureSoundEnabled(sound: Sound) {
        if (!_.contains(this.activeSounds, sound)) {
            this.activeSounds.push(sound);
        }
        sound.unmarkForDisable();
        sound.ensureEnabled();
    }
}