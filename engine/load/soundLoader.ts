class SoundLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private sound: Preload.Sound;

    constructor(key: string, sound: Preload.Sound) {
        this.key = key;
        this.sound = sound;
        this._completionPercent = 0;
    }

    getKey(): string {
        return this.key;
    }

    load(callback: () => void, onError: (message: string) => void) {
        let url = Preload.getAssetUrl(this.key, this.sound.url, 'ogg');
        WebAudio.preloadSound(this.key, url, () => {
            this.onLoad(callback, onError);
        });
    }

    private onLoad(callback: () => void, onError: (message: string) => void) {
        let preloadedSound = WebAudio.preloadedSounds[this.key];
        if (!preloadedSound) {
            onError(`Failed to load sound ${this.key}`);
            return;
        }

        let volume = this.sound.volume ?? 1;
        if (volume < 0 || volume > Sound.MAX_VOLUME) {
            onError(`Sound has invalid volume: ${this.sound}`);
            volume = M.clamp(volume, 0, Sound.MAX_VOLUME);
        }

        let speed = this.sound.speed ?? 1;
        if (speed < 0 || speed > Sound.MAX_SPEED) {
            onError(`Sound has invalid speed: ${this.sound}`);
            speed = M.clamp(speed, 0, Sound.MAX_SPEED);
        }

        AssetCache.sounds[this.key] = {
            buffer: preloadedSound.buffer,
            volume: volume,
            speed: speed
        };

        this._completionPercent = 1;
        callback();
    }
}