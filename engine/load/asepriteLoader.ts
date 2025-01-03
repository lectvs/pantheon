class AsepriteLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private texture: Preload.Texture;
    private pixiLoader: PIXI.Loader;

    constructor(key: string, textFile: Preload.Texture) {
        this.key = key;
        this.texture = textFile;
        this._completionPercent = 0;
        this.pixiLoader = new PIXI.Loader();
    }

    load(callback?: () => void) {
        let url = Preload.getAssetUrl(this.key, this.texture.url, 'aseprite');
        this.pixiLoader.add(this.key, url, { xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER });
        this.pixiLoader.load(() => {
            this.onLoadText();
            this._completionPercent = 1;
            if (callback) callback();
        });
    }

    private onLoadText() {
        let dataBuffer = this.pixiLoader.resources[this.key].data as ArrayBuffer;

        if (!dataBuffer) {
            console.error('Failed to load aseprite file:', this.key);
            return;
        }

        let bytesReader = new BytesReader(dataBuffer);

        console.log('bytesReader:', bytesReader);

        let rawFile = AsepriteFileRaw.readAsepriteFileRaw(bytesReader);

        console.log('raw file:', rawFile);

        let parsedFile = AsepriteFile.fromRaw(rawFile);

        console.log('parsed file:', parsedFile);
    }
}
