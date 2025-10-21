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

        this.soundManager = new SoundManager({
            volume: 1,
            humanizeByDefault: false,
        });
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

    fade(fadeVolume: number, fadeTime: number = 0) {
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

    hang() {
        if (this.state.state === 'stopped') return;
        this.state.currentMusic.hang();
    }

    pause(fadeTime: number = 0) {
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

    play(music: string | Sound, fadeTime: number = 0) {
        if (this.isMusicAlreadyPlaying(music)) {
            if (this.state.state === 'playing') {
                if (this.state.fadeVolume < 1) {
                    this.unfade(fadeTime);
                }
                return;
            }
            if (this.state.state === 'paused') {
                this.unpause(fadeTime);
                return;
            }
        }

        this.stop(fadeTime);
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

    stop(fadeTime: number = 0) {
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

    unfade(fadeTime: number = 0) {
        this.fade(1, fadeTime);
    }

    unpause(fadeTime: number = 0) {
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

    private isMusicAlreadyPlaying(music: string | Sound) {
        if (this.state.state === 'stopped') return false;
        if (St.isString(music)) return this.state.currentMusic.key === music;
        return this.state.currentMusic === music || this.state.currentMusic.key === music.key;
    }

    static TRANSITION_SCRIPT = 'transition';
}