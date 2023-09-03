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
        new TextureLoader(this.key, {
            url: this.getUrl(),
            spritesheet: { frameWidth: this.font.charWidth, frameHeight: this.font.charHeight, anchor: Vector2.TOP_LEFT },
        }).load(() => {
            this.onLoad();
            this._completionPercent = 1;
            if (callback) callback();
        });
    }

    private getUrl() {
        return this.font.url ?? `${this.key}.png`;
    }

    private onLoad() {
        let mainTexture = AssetCache.textures[this.key];
        if (!mainTexture) {
            console.error(`Failed to load tileset texture ${this.key}`);
            return;
        }

        let numCharsX = Math.floor(mainTexture.width / this.font.charWidth);
        let numCharsY = Math.floor(mainTexture.height / this.font.charHeight);

        if (numCharsX !== FontLoader.FONT_CHARACTERS[0].length || numCharsY !== FontLoader.FONT_CHARACTERS.length) {
            console.error(`Font '${this.key}' does not have the proper number of characters in each dimension: ${numCharsX},${numCharsY} (should be ${FontLoader.FONT_CHARACTERS[0].length},${FontLoader.FONT_CHARACTERS.length})`);
            return;
        }

        let charTextures: Dict<string> = {};

        for (let y = 0; y < FontLoader.FONT_CHARACTERS.length; y++) {
            for (let x = 0; x < FontLoader.FONT_CHARACTERS[y].length; x++) {
                let i = x + y*numCharsX;
                let char = FontLoader.FONT_CHARACTERS[y][x];
                AssetCache.textures[`${this.key}/chars/${char}`] = AssetCache.textures[`${this.key}/${i}`];
                delete AssetCache.textures[`${this.key}/${i}`];
                charTextures[char] = `${this.key}/chars/${char}`;
            }
        }

        if (this.font.customCharacters) {
            for (let char in this.font.customCharacters) {
                charTextures[char] = this.font.customCharacters[char];
            }
        }

        AssetCache.fonts[this.key] = {
            charTextures: charTextures,
            charWidth: this.font.charWidth,
            charHeight: this.font.charHeight,
            spaceWidth: this.font.spaceWidth,
            newlineHeight: this.font.newlineHeight
        };
    }

    private static FONT_CHARACTERS = [
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
        ['U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd'],
        ['e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
        ['o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'],
        ['y', 'z', '0', '1', '2', '3', '4', '5', '6', '7'],
        ['8', '9', '!', '@', '#', '$', '%', '^', '&', '*'],
        ['(', ')', '-', '_', '=', '+', '{', '}', '[', ']'],
        ['\\','|', ';', ':', "'", '"', ',', '.', '<', '>'],
        ['/', '?', '`' ,'~', 'garbage1', 'garbage2', 'garbage3', 'garbage4', 'garbage5', 'missing'],
    ];
}