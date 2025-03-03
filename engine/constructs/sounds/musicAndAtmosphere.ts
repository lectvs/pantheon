/// <reference path="../../sound/sound.ts" />

namespace MusicAndAtmosphere {
    export type Config = {
        musicKeys: string[];
        atmosphereKey: string;
        initialAtmosphereTime: number;
        atmosphereTime: number;
        musicTime: number;
        atmosphereToMusicFadeTime: number;
        musicToAtmosphereFadeTime: number;
        selectRandomNextTrack?: boolean;
    }
}

class MusicAndAtmosphere extends Sound {
    private atmosphereSound: Sound;
    private musicKeys: string[];
    private musicSounds: Sound[];
    private atmosphereTime: number;
    private musicTime: number;
    private atmosphereToMusicFadeTime: number;
    private musicToAtmosphereFadeTime: number;
    private shuffle: boolean;
    
    private currentPlaying: 'atmosphere' | 'music';
    private currentMusicI: number;
    private nextMusicI: number;
    private timeUntilSwitch: number;

    get duration() { return Infinity; }
    get done() { return false; }
    get onDone() { return Utils.NOOP; }
    set onDone(_) {}

    constructor(config: MusicAndAtmosphere.Config) {
        super('none');

        this.musicKeys = config.musicKeys;
        this.atmosphereSound = new BasicSound(config.atmosphereKey);
        this.atmosphereSound.loopsLeft = Infinity;
        this.atmosphereTime = config.atmosphereTime;
        this.musicTime = config.musicTime;
        this.atmosphereToMusicFadeTime = config.atmosphereToMusicFadeTime;
        this.musicToAtmosphereFadeTime = config.musicToAtmosphereFadeTime;
        this.shuffle = config.selectRandomNextTrack ?? false;

        this.musicSounds = this.musicKeys.map(key => {
            let sound = new BasicSound(key);
            sound.loopsLeft = Infinity;
            return sound;
        })

        this.currentPlaying = 'atmosphere';
        this.currentMusicI = Random.index(this.musicSounds);
        this.nextMusicI = Random.index(this.musicSounds);
        this.timeUntilSwitch = config.initialAtmosphereTime + this.atmosphereToMusicFadeTime;
    }

    update(delta: number) {
        this.pos += delta;
        this.timeUntilSwitch -= delta;

        this.atmosphereSound.controller = this.controller;
        this.musicSounds.forEach(sound => sound.controller = this.controller);

        let currentPlayingSound = this.getCurrentlyPlayingSound();
        let currentNotPlayingSound = this.getCurrentlyNotPlayingSound();

        let musicTransitionTime = this.currentPlaying === 'atmosphere'
            ? this.atmosphereToMusicFadeTime
            : this.musicToAtmosphereFadeTime;

        if (this.timeUntilSwitch > musicTransitionTime) {
            currentPlayingSound.volume = this.volume;
            currentNotPlayingSound.volume = 0;
            currentPlayingSound.update(delta);
        } else if (this.timeUntilSwitch > 0) {
            let t = mapClamp(this.timeUntilSwitch, musicTransitionTime, 0, 0, 1);
            currentPlayingSound.volume = (1 - t) * this.volume;
            currentNotPlayingSound.volume = t;
            currentPlayingSound.update(delta);
            currentNotPlayingSound.update(delta);
        } else {
            currentPlayingSound.volume = 0;
            currentNotPlayingSound.volume = this.volume;
            currentNotPlayingSound.update(delta);
            this.currentPlaying = this.currentPlaying === 'atmosphere' ? 'music' : 'atmosphere';

            if (this.currentPlaying === 'atmosphere') {
                this.timeUntilSwitch = this.atmosphereTime + musicTransitionTime;
                this.musicSounds[this.currentMusicI].seek(0);
            } else {
                this.timeUntilSwitch = this.musicTime + musicTransitionTime;
                this.currentMusicI = this.nextMusicI;
                if (this.shuffle) {
                    this.nextMusicI = Random.index(this.musicKeys);
                } else {
                    this.nextMusicI = mod(this.currentMusicI + 1, this.musicKeys.length);
                }
            }
        }
    }

    ensureDisabled() {
        this.atmosphereSound.ensureDisabled();
        this.musicSounds.forEach(musicSound => musicSound.ensureDisabled());
    }

    ensureEnabled() {
        let currentPlayingSound = this.getCurrentlyPlayingSound();
        let currentNotPlayingSound = this.getCurrentlyNotPlayingSound();

        let musicTransitionTime = this.currentPlaying === 'atmosphere'
            ? this.atmosphereToMusicFadeTime
            : this.musicToAtmosphereFadeTime;

        if (this.timeUntilSwitch > musicTransitionTime) {
            currentPlayingSound.ensureEnabled();
        } else if (this.timeUntilSwitch > 0) {
            currentPlayingSound.ensureEnabled();
            currentNotPlayingSound.ensureEnabled();
        } else {
            currentNotPlayingSound.ensureEnabled();
        }
    }

    override hang(): void {
        super.hang();
        this.hanging = true;
    }

    seek(position: number) {
        console.error('seek() not supported', this);
    }

    stop() {
        this.hanging = false;
    }

    setFilter(filter: WebAudioFilter) {
        this.atmosphereSound.setFilter(filter);
        this.musicSounds.forEach(musicSound => musicSound.setFilter(filter));
    }

    private getCurrentlyPlayingSound() {
        if (this.currentPlaying === 'atmosphere') return this.atmosphereSound;
        return this.musicSounds[this.currentMusicI];
    }

    private getCurrentlyNotPlayingSound() {
        if (this.currentPlaying === 'music') return this.atmosphereSound;
        return this.musicSounds[this.nextMusicI];
    }
}