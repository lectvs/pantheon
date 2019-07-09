// Only meant to be populated by Preload
class AssetCache {
    static textures: Dict<PIXI.Texture> = {};
    static tilemaps: Dict<Tilemap.Tilemap> = {};

    static getTexture(key: string) {
        if (!this.textures[key]) {
            debug(`Texture '${key}' does not exist.`);
        }
        return this.textures[key];
    }

    static getTilemap(key: string) {
        if (!this.tilemaps[key]) {
            debug(`Tilemap '${key}' does not exist.`);
        }
        return this.tilemaps[key];
    }

    static DEFAULT_ANCHOR: Pt = { x: 0, y: 0 };
}