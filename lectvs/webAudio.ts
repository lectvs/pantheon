namespace WebAudio {
    export type PreloadedSound = {
        buffer: AudioBuffer;
    }
}

class WebAudio {
    static preloadedSounds: Dict<WebAudio.PreloadedSound> = {};
    static globalContext: AudioContext;
    static worldContext: AudioContext;

    private static _started: boolean = false;
    static get started() { return this._started || this.globalContext.state === 'running'; }

    static start() {
        if (this.started) return;
        this.globalContext.resume();
        this.worldContext.resume();
        this._started = true;
    }

    static initContext() {
        try {
            // @ts-ignore
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.globalContext = new AudioContext();
            this.worldContext = new AudioContext();
        } catch(e) {
            error('Web Audio API is not supported in this browser. Sounds will not be able to play.');
        }
    }

    static preloadSound(key: string, url: string, cb?: Function) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            WebAudio.globalContext.decodeAudioData(request.response,
                (buffer: AudioBuffer) => {
                    WebAudio.preloadedSounds[key] = {
                        buffer: buffer,
                    };
                    if (cb) cb();
                },
                (e) => {
                    error(`Could not decode sound ${key}:`, e);
                }
            );
        }
        request.send();
    }
}