class MusicManager {
    private musics: Sound[];
    private transitionScript: Script;
    paused: boolean;

    get volume() { return this.baseVolume * this.volumeScale; }

    baseVolume: number;
    volumeScale: number;

    get currentMusic() { return _.last(this.musics); }
    get currentMusicKey() { return this.currentMusic?.key; }

    constructor() {
        this.musics = [];
        this.paused = false;
        this.baseVolume = 1;
        this.volumeScale = 1;
    }

    update(delta: number) {
        if (this.transitionScript) {
            this.transitionScript.update(delta);
            if (this.transitionScript.done) {
                this.transitionScript = null;
            }
        }

        for (let i = this.musics.length-1; i >= 0; i--) {
            if (!this.paused && !this.musics[i].paused) {
                this.musics[i].update(delta);
            }
            if (this.musics[i].done) {
                this.musics.splice(i, 1);
            }
        }
    }

    pauseMusic(fadeTime: number = 0) {
        if (fadeTime <= 0) {
            this.paused = true;
        } else {
            let startVolumes = this.musics.map(m => m.volume);
            this.transitionScript = new Script(S.chain(
                S.doOverTime(fadeTime, t => {
                    for (let i = 0; i < this.musics.length; i++) {
                        this.musics[i].volume = startVolumes[i] * (1-t);
                    }
                }),
                S.call(() => {
                    for (let i = 0; i < this.musics.length; i++) {
                        this.musics[i].volume = startVolumes[i];
                    }
                    this.paused = true;
                })
            ));
        }
    }

    playMusic(key: string, fadeTime: number = 0) {
        this.paused = false;

        // TODO: this really needs to be fixed
        if (this.currentMusicKey === key && !this.transitionScript) {
            let music = this.currentMusic;
            let currentVolume = music.volume;
            music.volume = 0;
            this.transitionScript = new Script(S.chain(
                S.doOverTime(fadeTime, t => {
                    music.volume = t * currentVolume;
                }),
            ));
            return music;
        }

        let music = new Sound(key, this);
        music.loop = true;

        if (fadeTime <= 0) {
            this.musics = [music];
            this.transitionScript = null;
        } else {
            this.musics.push(music);
            music.volume = 0;
            
            let startVolumes = this.musics.map(m => m.volume);
            this.transitionScript = new Script(S.chain(
                S.doOverTime(fadeTime, t => {
                    for (let i = 0; i < this.musics.length-1; i++) {
                        this.musics[i].volume = startVolumes[i] * (1-t);
                    }
                    music.volume = t;
                }),
                S.call(() => {
                    this.musics = [music];
                })
            ));
        }
        return music;
    }

    stopMusic(fadeTime: number = 0) {
        if (fadeTime <= 0) {
            this.musics = [];
            this.transitionScript = null;
        } else {
            let startVolumes = this.musics.map(m => m.volume);
            this.transitionScript = new Script(S.chain(
                S.doOverTime(fadeTime, t => {
                    for (let i = 0; i < this.musics.length; i++) {
                        this.musics[i].volume = startVolumes[i] * (1-t);
                    }
                }),
                S.call(() => {
                    this.musics = [];
                })
            ));
        }
    }

    unpauseMusic() {
        this.paused = false;
    }
}