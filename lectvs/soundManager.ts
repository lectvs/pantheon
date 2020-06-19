class SoundManager {
    private activeSounds: Sound[];

    constructor() {
        this.activeSounds = [];
    }

    update() {
        for (let i = this.activeSounds.length-1; i >= 0; i--) {
            this.activeSounds[i].update();
            if (this.activeSounds[i].done) {
                this.activeSounds.splice(i, 1);
            }
        }
    }

    playSound(sound: string | SoundAsset, parentWorld?: World) {
        if (_.isString(sound)) {
            sound = AssetCache.getSound(sound);
            if (!sound) return;
        }

        let soundInstance = sound.play(parentWorld);
        this.activeSounds.push(soundInstance);
        return soundInstance;
    }
}