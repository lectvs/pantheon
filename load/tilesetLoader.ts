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

    load(callback?: () => void) {
        new TextureLoader(this.key, {
            url: this.getUrl(),
            spritesheet: { frameWidth: this.tileset.tileWidth, frameHeight: this.tileset.tileHeight, anchor: Vector2.CENTER },
        }).load(() => {
            this.onLoad();
            this._completionPercent = 1;
            if (callback) callback();
        });
    }

    private getUrl() {
        return this.tileset.url ?? `${this.key}.png`;
    }

    private onLoad() {
        let mainTexture = AssetCache.textures[this.key];
        if (!mainTexture) {
            console.error(`Failed to load tileset texture ${this.key}`);
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
    }
}