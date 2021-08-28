class FontLoader implements Loader {
    private _completionPercent: number;
    get completionPercent() { return this._completionPercent; }

    private key: string;
    private font: Preload.Font;

    constructor(key: string, font: Preload.Font) {
        this.key = key;
        this.font = font;
        this._completionPercent = 0;
    }

    load(callback?: () => void) {
        let url = this.font.url ?? `${this.key}.png`;

        new TextureLoader(this.key, {
            url: url,
            spritesheet: { frameWidth: this.font.charWidth, frameHeight: this.font.charHeight, anchor: Vector2.TOP_LEFT },
        }).load(() => {
            this.onLoad();
            this._completionPercent = 1;
            if (callback) callback();
        });
    }

    private onLoad() {
        let mainTexture = AssetCache.textures[this.key];
        if (!mainTexture) {
            error(`Failed to load tileset texture ${this.key}`);
            return;
        }

        let numCharsX = Math.floor(mainTexture.width / this.font.charWidth);
        let numCharsY = Math.floor(mainTexture.height / this.font.charHeight);
        let numChars = numCharsX * numCharsY;

        let charTextures: string[] = A.range(numChars).map(i => `${this.key}/${i}`);

        AssetCache.fonts[this.key] = {
            charTextures: charTextures,
            charWidth: this.font.charWidth,
            charHeight: this.font.charHeight,
            spaceWidth: this.font.spaceWidth,
            newlineHeight: this.font.newlineHeight
        };
    }
}