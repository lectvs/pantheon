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

    load(callback?: () => void) {
        let url = Preload.getAssetUrl(this.key, this.textFile.url, 'txt');
        this.pixiLoader.add(this.key, url);
        this.pixiLoader.load(() => {
            this.onLoadText();
            this._completionPercent = 1;
            if (callback) callback();
        });
    }

    private onLoadText() {
        let textContent = this.pixiLoader.resources[this.key].data;

        if (!textContent) {
            console.error('Failed to load text file:', this.key);
            return;
        }

        textContent = textContent.replace(/\r\n/g, '\n');

        AssetCache.textFiles[this.key] = textContent;
    }
}
