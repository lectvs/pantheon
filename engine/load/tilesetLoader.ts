class TilesetLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private tileset: Preload.Tileset;

    constructor(key: string, tileset: Preload.Tileset) {
        this.key = key;
        this.tileset = tileset;
        this._completionPercent = 0;
    }

    getKey(): string {
        return this.key;
    }

    load(callback: () => void, onError: (message: string) => void) {
        new TextureLoader(this.key, {
            url: this.getUrl(),
            anchor: Anchor.CENTER,
            spritesheet: { width: this.tileset.tileWidth, height: this.tileset.tileHeight },
        }).load(() => {
            this.onLoad(callback, onError);
        }, onError);
    }

    private getUrl() {
        return this.tileset.url ?? `${this.key}.png`;
    }

    private onLoad(callback: () => void, onError: (message: string) => void) {
        let mainTexture = AssetCache.textures[this.key];
        if (!mainTexture) {
            onError('Failed to load tileset texture');
            return;
        }

        let numTilesX = Math.floor(mainTexture.width / this.tileset.tileWidth);
        let numTilesY = Math.floor(mainTexture.height / this.tileset.tileHeight);
        let numTiles = numTilesX * numTilesY;

        let tiles: string[] = A.range(numTiles).map(i => `${this.key}/${i}`);

        AssetCache.tilesets[this.key] = {
            tileWidth: this.tileset.tileWidth,
            tileHeight: this.tileset.tileHeight,
            tiles: tiles,
            collisionIndices: this.tileset.collisionIndices,
        };

        this._completionPercent = 1;
        callback();
    }
}