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
    volume: number;

    private soundManager: SoundManager;
    private scriptManager: ScriptManager;

    private state: MusicManager.State;

    constructor() {
        this.paused = false;
        this.volume = 1;

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

    playMusic(key: string, fadeTime: number = 0) {
        if (this.state.state !== 'stopped' && this.state.currentMusic.key === key) {
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
        let music = this.soundManager.playSound(key);
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
            S.call(() => music.stop()),
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