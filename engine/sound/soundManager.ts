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

    getSoundCountByKey(key: string) {
        return A.count(this.sounds, sound => sound.key === key);
    }

    getSoundsByKey(key: string) {
        return this.sounds.filter(sound => sound.key === key);
    }

    playSound(sound: string | Sound) {
        if (St.isString(sound)) {
            sound = new BasicSound(sound, this);
        }
        sound.controller = this;  // Can be changed, but important right now so music volume can be controlled.
        this.sounds.push(sound);
        return sound;
    }

    stopSound(sound: string | Sound) {
        let sounds = St.isString(sound)
            ? this.sounds.filter(s => s.key === sound)
            : [sound];
        
        for (let sound of sounds) {
            sound.stop();
            A.removeAll(this.sounds, sound);
        }
    }
}