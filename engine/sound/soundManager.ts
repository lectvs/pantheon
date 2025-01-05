namespace SoundManager {
    export type Config = {
        volume?: number;
        humanizeByDefault?: boolean;
        /**
         * Default: 0.1
         */
        humanizeFactor?: number;
    }

    export type PlaySoundConfig = {
        volume?: number;
        speed?: number;
        loop?: boolean | number;
        humanized?: boolean;
        limit?: number;
    }
}

class SoundManager {
    private sounds: Sound[];

    volume: number;

    humanizeByDefault: boolean;
    humanizeFactor: number;

    constructor(config: SoundManager.Config) {
        this.sounds = [];
        this.volume = config.volume ?? 1;
        this.humanizeByDefault = config.humanizeByDefault ?? false;
        this.humanizeFactor = config.humanizeFactor ?? 0.1;
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

    getSoundCount(sound: string | Sound) {
        return A.count(this.sounds, s => s === sound || s.key === sound);
    }

    getSoundsByKey(key: string) {
        return this.sounds.filter(sound => sound.key === key);
    }

    playSound(sound: string | Sound, config?: SoundManager.PlaySoundConfig) {
        if (config?.limit !== undefined && (global.soundManager.getSoundCount(sound) >= config.limit || this.getSoundCount(sound) >= config.limit)) {
            return St.isString(sound) ? new BasicSound(sound) : sound;
        }

        if (St.isString(sound)) {
            sound = new BasicSound(sound, this);
        }

        sound.controller = this;  // Can be changed, but important right now so music volume can be controlled.

        sound.volume = config?.volume ?? 1;
        sound.speed = config?.speed ?? 1;

        let loop = config?.loop ?? false;
        sound.loopsLeft = M.isNumber(loop) ? loop : (loop ? Infinity : 0);

        let humanized = (config?.humanized ?? this.humanizeByDefault) && sound.duration < 1;
        if (humanized && this.humanizeFactor > 0) {
            sound.humanize(this.humanizeFactor);
        }

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