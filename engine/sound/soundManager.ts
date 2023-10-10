class SoundManager {
    private sounds: Sound[];

    volume: number;

    constructor() {
        this.sounds = [];
        this.volume = 1;
    }

    update(delta: number) {
        for (let i = this.sounds.length-1; i >= 0; i--) {
            if (!this.sounds[i].paused) {
                this.sounds[i].update(delta);
            }
            if (this.sounds[i].done) {
                this.sounds.splice(i, 1);
            }
        }
    }

    playSound(key: string) {
        let sound = new Sound(key, this);
        this.sounds.push(sound);
        return sound;
    }

    getSoundsByKey(key: string) {
        return this.sounds.filter(sound => sound.key === key);
    }
}