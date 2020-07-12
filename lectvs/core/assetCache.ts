// Only meant to be populated by Preload
class AssetCache {
    static pixiTextures: Dict<PIXI.Texture> = {};
    static textures: Dict<Texture> = {};
    static sounds: Dict<WebAudioSound.Asset> = {};
    static tilemaps: Dict<Tilemap.Tilemap> = {};

    static getPixiTexture(key: string) {
        if (!this.pixiTextures[key]) {
            error(`Texture '${key}' does not exist.`);
        }
        return this.pixiTextures[key];
    }

    static getTexture(key: string) {
        if (!this.textures[key]) {
            error(`Texture '${key}' does not exist.`);
            return Texture.none();
        }
        return this.textures[key];
    }

    static getSoundAsset(key: string): WebAudioSound.Asset {
        if (!this.sounds[key]) {
            error(`Sound '${key}' does not exist.`);
            return { buffer: new AudioBuffer({ length: 0, sampleRate: 8000 }) };
        }
        return this.sounds[key];
    }

    static getTilemap(key: string) {
        if (!this.tilemaps[key]) {
            error(`Tilemap '${key}' does not exist.`);
        }
        return this.tilemaps[key];
    }
}