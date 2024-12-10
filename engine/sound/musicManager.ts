namespace MusicManager {
    export type State = {
        state: 'stopped';
    } | {
        state: 'playing';
        currentMusic: Sound;
        fadeVolume: number;
    } | {
        state: 'paused';
        currentMusic: Sound;
        fadeVolume: number;
    };
}

class MusicManager {
    paused: boolean;

    private soundManager: SoundManager;
    private scriptManager: ScriptManager;

    private state: MusicManager.State;

    get volume() { return this.soundManager.volume; }
    set volume(v) { this.soundManager.volume = v }

    constructor() {
        this.paused = false;

        this.soundManager = new SoundManager();
        this.scriptManager = new ScriptManager();

        this.state = {
            state: 'stopped',
        };
    }

    update(delta: number) {
        if (!this.paused) {
            this.soundManager.update(delta);
            this.scriptManager.update(delta);
        }
    }

    fadeMusic(fadeVolume: number, fadeTime: number = 0) {
        if (this.state.state === 'stopped') return;
        let music = this.state.currentMusic;
        let startVolume = music.volume;
        this.scriptManager.runScript(S.tween(fadeTime, music, 'volume', startVolume, fadeVolume),
            MusicManager.TRANSITION_SCRIPT, 'stopPrevious');
        this.state.fadeVolume = fadeVolume;
    }

    getCurrentMusicKey() {
        if (this.state.state === 'stopped') return undefined;
        return this.state.currentMusic.key;
    }

    pauseMusic(fadeTime: number = 0) {
        if (this.state.state === 'stopped') return;
        let music = this.state.currentMusic;
        let startVolume = music.volume;
        this.scriptManager.runScript(S.chain(
            S.tween(fadeTime, music, 'volume', startVolume, 0),
            S.call(() => music.paused = true),
        ), MusicManager.TRANSITION_SCRIPT, 'stopPrevious');
        this.state = {
            state: 'paused',
            currentMusic: music,
            fadeVolume: this.state.fadeVolume,
        };
    }

    playMusic(music: string | Sound, fadeTime: number = 0) {
        let musicAlreadyPlaying =  (St.isString(music) && this.state.state !== 'stopped' && this.state.currentMusic.key === music)
                                || (!St.isString(music) && this.state.state !== 'stopped' && this.state.currentMusic === music);
        if (musicAlreadyPlaying) {
            if (this.state.state === 'playing') {
                if (this.state.fadeVolume < 1) {
                    this.unfadeMusic(fadeTime);
                }
                return;
            }
            if (this.state.state === 'paused') {
                this.unpauseMusic(fadeTime);
                return;
            }
        }

        this.stopMusic(fadeTime);
        music = this.soundManager.playSound(music);
        music.loopsLeft = Infinity;
        this.scriptManager.runScript(S.tween(fadeTime, music, 'volume', 0, 1),
            MusicManager.TRANSITION_SCRIPT, 'stopPrevious');
        this.state = {
            state: 'playing',
            currentMusic: music,
            fadeVolume: 1,
        };
    }

    stopMusic(fadeTime: number = 0) {
        if (this.state.state === 'stopped') return;
        let music = this.state.currentMusic;
        let startVolume = music.volume;
        this.scriptManager.runScript(S.chain(
            S.tween(fadeTime, music, 'volume', startVolume, 0),
            S.call(() => this.soundManager.stopSound(music)),
        ));
        this.state = {
            state: 'stopped',
        };
    }

    unfadeMusic(fadeTime: number = 0) {
        this.fadeMusic(1, fadeTime);
    }

    unpauseMusic(fadeTime: number = 0) {
        if (this.state.state === 'stopped') return;
        let music = this.state.currentMusic;
        let startVolume = music.volume;
        music.paused = false;
        this.scriptManager.runScript(S.tween(fadeTime, music, 'volume', startVolume, 1),
            MusicManager.TRANSITION_SCRIPT, 'stopPrevious');
        this.state = {
            state: 'playing',
            currentMusic: music,
            fadeVolume: this.state.fadeVolume,
        };
    }

    static TRANSITION_SCRIPT = 'transition';
}