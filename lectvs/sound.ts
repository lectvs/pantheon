class Sound {
    private howl: Howler.Howl;
    private id: number;
    private parentWorld: World;

    get volume() { return <number>this.howl.volume(this.id); }
    set volume(value: number) { this.howl.volume(value, this.id); }

    private _done: boolean;
    get done() { return this._done; }

    paused: boolean;

    constructor(howl: Howler.Howl, id: number, parentWorld?: World) {
        this.howl = howl;
        this.id = id;
        this.parentWorld = parentWorld;
        this._done = false;
        this.paused = false;

        this.howl.on("end", () => {
            debug('done')
            this._done = true;
        }, this.id);
    }

    update() {
        if (this.paused
            || (this.parentWorld && this.parentWorld.paused)) {
            this.howl.pause(this.id);
        } else {
            this.howl.play(this.id);
        }
    }
}
