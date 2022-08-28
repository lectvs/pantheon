// Only meant to be populated by Preload
class AssetCache {
    static pixiTextures: Dict<PIXI.Texture> = {};
    static textures: Dict<Texture> = {};
    static sounds: Dict<WebAudioSound.Asset> = {};
    static tilesets: Dict<Tilemap.Tileset> = {};
    static tilemaps: Dict<Tilemap.Tilemap> = {};
    static fonts: Dict<SpriteText.Font> = {};
    static lciDocuments: Dict<Lci.Document> = {};

    static getPixiTexture(key: string) {
        if (!this.pixiTextures[key]) {
            console.error(`Texture '${key}' does not exist.`);
        }
        return this.pixiTextures[key];
    }

    static getTexture(key: string): Texture {
        if (this.isNoneTexture(key)) {
            return Texture.NONE;
        }
        if (!this.textures[key]) {
            console.error(`Texture '${key}' does not exist.`);
            return Texture.NONE;
        }
        return this.textures[key];
    }

    static getSoundAsset(key: string): WebAudioSound.Asset {
        if (!this.sounds[key]) {
            console.error(`Sound '${key}' does not exist.`);
            return { buffer: new AudioBuffer({ length: 1, sampleRate: 8000 }), volume: 1, speed: 1 };
        }
        return this.sounds[key];
    }

    static getTileset(key: string) {
        if (!this.tilesets[key]) {
            console.error(`Tileset '${key}' does not exist.`);
        }
        return this.tilesets[key];
    }

    static getTilemap(key: string) {
        if (!this.tilemaps[key]) {
            console.error(`Tilemap '${key}' does not exist.`);
        }
        return this.tilemaps[key];
    }

    static getFont(key: string) {
        if (!this.fonts[key]) {
            console.error(`Font '${key}' does not exist.`);
        }
        return this.fonts[key];
    }

    static getLciDocument(key: string) {
        if (!this.lciDocuments[key]) {
            console.error(`LCI document '${key}' does not exist.`);
        }
        return this.lciDocuments[key];
    }

    static isNoneTexture(key: string) {
        return !key || key === 'none' || key.startsWith('none/');
    }
}