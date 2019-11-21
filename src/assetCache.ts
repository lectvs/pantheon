// Only meant to be populated by Preload
class AssetCache {
    static textures: Dict<PIXI.Texture> = {};
    static textures2: Dict<Texture> = {};
    static tilemaps: Dict<Tilemap.Tilemap> = {};

    static getTexture(key: string) {
        if (!this.textures[key]) {
            debug(`Texture '${key}' does not exist.`);
        }
        return this.textures[key];
    }

    static getTexture2(key: string) {
        if (!this.textures2[key]) {
            debug(`Texture2 '${key}' does not exist.`);
        }
        return this.textures2[key];
    }

    static getTilemap(key: string) {
        if (!this.tilemaps[key]) {
            debug(`Tilemap '${key}' does not exist.`);
        }
        return this.tilemaps[key];
    }

    static DEFAULT_ANCHOR: Pt = { x: 0, y: 0 };
}