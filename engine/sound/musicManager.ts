namespace MusicManager {
    export type State = {
        state: 'stopped';
    } | {
        state: 'playing';
        currentMusic: Sound;
        transitionScript: Script;
    } | {
        state: 'paused';
        currentMusic: Sound;
        transitionScript: Script;
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

    getCurrentMusicKey() {
        if (this.state.state === 'stopped') return undefined;
        return this.state.currentMusic.key;
    }

    pauseMusic(fadeTime: number = 0) {
        if (this.state.state === 'stopped') return;
        this.state.transitionScript.stop();
        let music = this.state.currentMusic;
        let startVolume = music.volume;
        let pauseScript = this.scriptManager.runScript(S.chain(
            S.tween(fadeTime, music, 'volume', startVolume, 0),
            S.call(() => music.paused = true),
        ));
        this.state = {
            state: 'paused',
            currentMusic: music,
            transitionScript: pauseScript,
        };
    }

    playMusic(key: string, fadeTime: number = 0) {
        if (this.state.state !== 'stopped' && this.state.currentMusic.key === key) {
            if (this.state.state === 'playing') return;
            if (this.state.state === 'paused') {
                this.unpauseMusic(fadeTime);
                return;
            }
        }

        this.stopMusic(fadeTime);
        let music = this.soundManager.playSound(key);
        music.loopsLeft = Infinity;
        let playScript = this.scriptManager.runScript(S.tween(fadeTime, music, 'volume', 0, 1));
        this.state = {
            state: 'playing',
            currentMusic: music,
            transitionScript: playScript,
        };
    }

    stopMusic(fadeTime: number = 0) {
        if (this.state.state === 'stopped') return;
        this.state.transitionScript.stop();
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

    unpauseMusic(fadeTime: number = 0) {
        if (this.state.state === 'stopped') return;
        this.state.transitionScript.stop();
        let music = this.state.currentMusic;
        let startVolume = music.volume;
        music.paused = false;
        let unpauseScript = this.scriptManager.runScript(S.tween(fadeTime, music, 'volume', startVolume, 1));
        this.state = {
            state: 'playing',
            currentMusic: music,
            transitionScript: unpauseScript,
        };
    }
}