// Only meant to be populated by Preload
class AssetCache {
    static textures: {[key: string]: PIXI.Texture} = {};

    static getTexture(key: string) {
        if (!this.textures[key]) {
            debug(`Texture '${key}' does not exist.`);
        }
        return this.textures[key];
    }

    static DEFAULT_ANCHOR: Pt = { x: 0, y: 0 };
}