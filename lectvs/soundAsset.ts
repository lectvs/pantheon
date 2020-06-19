class SoundAsset {
    private howl: Howler.Howl;

    constructor(howl: Howler.Howl) {
        this.howl = howl;
        this.init();
    }

    play(parentWorld?: World) {
        debug(this.howl);
        let id = this.howl.play();
        debug(id);
        return new Sound(this.howl, id, parentWorld);
    }

    private init() {
        // For some reason, when a Howl is told to "play" a sound, and there is exactly 1 paused sound in the bank,
        // it will attempt to play that sound... I don't know why they decided to do it that way, but to get around it
        // we'll just start up 2 sounds and immediately pause them.
        let id1 = this.howl.play();
        let id2 = this.howl.play();
        this.howl.pause(id1);
        this.howl.pause(id2);
    }
}

namespace SoundAsset {
    export function none() {
        return new SoundAsset(undefined);
    }
}