class CustomResourceLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private loadFn: () => void;

    constructor(loadFn: () => void) {
        this.loadFn = loadFn;
        this._completionPercent = 0;
    }

    load(callback?: () => void) {
        async(() => {
            this.loadFn();
            this._completionPercent = 1;
            if (callback) callback();
        });
    }
}