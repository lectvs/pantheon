namespace WebAudio {
    export type PreloadedSound = {
        buffer: AudioBuffer;
        url: string;
    }
}

class WebAudio {
    static preloadedSounds: Dict<WebAudio.PreloadedSound> = {};
    static context: AudioContext;

    static get started() { return this.context && this.context.state === 'running'; }

    static start() {
        this.context.resume();
    }

    static initContext() {
        try {
            // @ts-ignore
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        } catch(e) {
            console.error('Web Audio API is not supported in this browser. Sounds will not be able to play.');
        }
    }

    static preloadSound(key: string, url: string, cb?: Function) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            WebAudio.context.decodeAudioData(request.response,
                (buffer: AudioBuffer) => {
                    WebAudio.preloadedSounds[key] = {
                        buffer: buffer,
                        url: url,
                    };
                    if (cb) cb();
                },
                (e) => {
                    console.error(`Could not decode sound ${key}:`, e);
                }
            );
        }
        request.send();
    }
}