class SoundManager {
    private activeSounds: Sound[];

    private webAudioStarted: boolean;

    constructor() {
        this.activeSounds = [];
        this.webAudioStarted = false;
    }

    update() {
        if (!this.webAudioStarted) {
            if (WebAudio.started) {
                this.onWebAudioStart();
                this.webAudioStarted = true;
            }
        }

        for (let i = this.activeSounds.length-1; i >= 0; i--) {
            if (this.activeSounds[i].done) {
                this.activeSounds.splice(i, 1);
            }
        }
    }

    playSound(sound: string | Sound.Asset, soundType: Sound.Type = Sound.Type.GLOBAL) {
        if (_.isString(sound)) {
            sound = AssetCache.getSoundAsset(sound);
            if (!sound) return;
        }

        let soundInstance = new Sound(sound, soundType);
        this.activeSounds.push(soundInstance);
        return soundInstance;
    }

    clearSounds() {
        for (let sound of this.activeSounds) {
            sound.pause();
        }
        this.activeSounds = [];
    }

    onWebAudioStart() {
        for (let sound of this.activeSounds) {
            sound.onWebAudioStart();
        }
    }
}