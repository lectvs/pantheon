class MusicManager {
    private musics: Sound[];
    private transitionScript: Script;
    private paused: boolean;

    volume: number;

    get currentMusic() { return _.last(this.musics); }
    get currentMusicKey() { return this.currentMusic?.key; }

    constructor() {
        this.musics = [];
        this.paused = false;
        this.volume = 1;
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

    pauseMusic() {
        this.paused = true;
    }

    playMusic(key: string, fadeTime: number = 0) {
        this.paused = false;

        if (this.currentMusicKey === key && !this.transitionScript) {
            return this.currentMusic;
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