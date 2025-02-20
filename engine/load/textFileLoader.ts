class TextFileLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private textFile: Preload.TextFile;
    private pixiLoader: PIXI.Loader;

    constructor(key: string, textFile: Preload.TextFile) {
        this.key = key;
        this.textFile = textFile;
        this._completionPercent = 0;
        this.pixiLoader = new PIXI.Loader();
    }

    getKey(): string {
        return this.key;
    }

    load(callback: () => void, onError: (message: string) => void) {
        let url = Preload.getAssetUrl(this.key, this.textFile.url, 'txt');
        this.pixiLoader.add(this.key, url);
        this.pixiLoader.onError.add(() => onError('Failed to load text file'));
        this.pixiLoader.load(() => {
            this.onLoadText(callback, onError);
        });
    }

    private onLoadText(callback: () => void, onError: (message: string) => void) {
        let textContent = this.pixiLoader.resources[this.key].data;

        if (!textContent) {
            onError('Failed to load text file');
            return;
        }

        textContent = textContent.replace(/\r\n/g, '\n');

        AssetCache.textFiles[this.key] = textContent;

        this._completionPercent = 1;
        callback();
    }
}
