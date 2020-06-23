class SoundManager {
    private activeSounds: Sound[];

    private webAudioStarted: boolean;

    constructor() {
        this.activeSounds = [];
        this.webAudioStarted = false;
    }

    preGameUpdate() {
        if (!this.webAudioStarted) {
            if (WebAudio.started) {
                this.onWebAudioStart();
                this.webAudioStarted = true;
            }
        }

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

    onWebAudioStart() {
        for (let sound of this.activeSounds) {
            sound.onWebAudioStart();
        }
    }
}