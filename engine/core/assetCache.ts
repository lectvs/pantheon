// Only meant to be populated by Preload
class AssetCache {
    static textures: Dict<PIXI.Texture> = {};
    static sounds: Dict<WebAudioSound.Asset> = {};
    static tilesets: Dict<Tilemap.Tileset> = {};
    static tilemaps: Dict<Tilemap.Tilemap> = {};
    static ldtkWorlds: Dict<LdtkWorld.LdtkWorld> = {};
    static fonts: Dict<SpriteText.Font> = {};
    static lciDocuments: Dict<Lci.Document> = {};

    static getTexture(key: string): PIXI.Texture {
        if (this.isNoneTexture(key)) {
            return Textures.NONE;
        }
        if (!this.textures[key]) {
            console.error(`Texture '${key}' does not exist.`);
            return Textures.NONE;
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

    static getTileset(key: string): Tilemap.Tileset | undefined {
        if (!this.tilesets[key]) {
            console.error(`Tileset '${key}' does not exist.`);
        }
        return this.tilesets[key];
    }

    static getTilemap(key: string): Tilemap.Tilemap | undefined {
        if (!this.tilemaps[key]) {
            console.error(`Tilemap '${key}' does not exist.`);
        }
        return this.tilemaps[key];
    }

    static getLdtkWorld(key: string): LdtkWorld.LdtkWorld | undefined {
        if (!this.ldtkWorlds[key]) {
            console.error(`Ldtk world '${key}' does not exist.`);
        }
        return this.ldtkWorlds[key];
    }

    static getFont(key: string): SpriteText.Font | undefined {
        if (!this.fonts[key]) {
            console.error(`Font '${key}' does not exist.`);

        }
        return this.fonts[key];
    }

    static getLciDocument(key: string): Lci.Document | undefined {
        if (!this.lciDocuments[key]) {
            console.error(`LCI document '${key}' does not exist.`);
        }
        return this.lciDocuments[key];
    }

    /* HELPERS */

    static isNoneTexture(key: string): boolean {
        return !key || key === 'none' || key.startsWith('none/');
    }
}