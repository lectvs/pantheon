class CustomResourceLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private loadFn: () => void;

    constructor(key: string, loadFn: () => void) {
        this.key = key;
        this.loadFn = loadFn;
        this._completionPercent = 0;
    }

    getKey(): string {
        return this.key;
    }

    load(callback: () => void, onError: (message: string) => void) {
        async(() => {
            this.loadFn();
            this._completionPercent = 1;
            callback();
        });
    }
}