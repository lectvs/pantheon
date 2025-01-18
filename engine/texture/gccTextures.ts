namespace GCCTextures {
    const GCC_TEXTURE_KEY = 'gccTextureKey';
    const GCC_TEXTURE_FACTORY = 'gccTextureFactory';
    const GCC_TEXTURE_DESTROYED = 'gccTextureDestroyed';

    const GCC_TEXTURE_CACHE_WARN_LIMIT = 100;

    export type CacheEntry = {
        texture: PIXI.RenderTexture;
        worldObjects: WorldObject[];
    }

    export const CACHE: Dict<CacheEntry> = {};

    export function getOrCacheTexture(key: string, textureFactory: () => PIXI.RenderTexture) {
        if (!CACHE[key]) {
            CACHE[key] = {
                texture: createTexture(key, textureFactory),
                worldObjects: [],
            };
        }

        if (O.size(CACHE) > GCC_TEXTURE_CACHE_WARN_LIMIT) {
            console.warn('Too many GCCTextures in the cache! Is there a memory leak?', O.clone(CACHE));
        }

        return CACHE[key].texture;
    }

    export function registerWorldObjectTexture(gccTexture: PIXI.RenderTexture, worldObject: WorldObject) {
        let key = O.getMetadata(gccTexture, GCC_TEXTURE_KEY) as string;

        if (!CACHE[key]) {
            console.error('Tried to register GCCTexture which is not in the cache:', key, gccTexture, worldObject);
            return;
        }

        if (!CACHE[key].worldObjects.includes(worldObject)) {
            CACHE[key].worldObjects.push(worldObject);
        }
    }

    export function unregisterWorldObjectTexture(gccTexture: PIXI.RenderTexture, worldObject: WorldObject) {
        let key = O.getMetadata(gccTexture, GCC_TEXTURE_KEY) as string;

        if (!CACHE[key]) {
            return;
        }

        A.removeAll(CACHE[key].worldObjects, worldObject);
    }

    export function garbageCollect() {
        for (let key in CACHE) {
            CACHE[key].worldObjects.filterInPlace(obj => obj.world && !obj.world.isUnloaded());
            if (CACHE[key].worldObjects.length === 0) {
                freePixiRenderTexture(CACHE[key].texture);
                O.putMetadata(CACHE[key].texture, GCC_TEXTURE_DESTROYED, true);
                delete CACHE[key];
            }
        }
    }

    export function isGCCTexture(texture: PIXI.Texture): texture is PIXI.RenderTexture {
        if (!(texture instanceof PIXI.RenderTexture)) return false;
        return St.isString(O.getMetadata(texture, GCC_TEXTURE_KEY));
    }

    export function isGCCTextureDestroyed(texture: PIXI.Texture): texture is PIXI.RenderTexture {
        if (!isGCCTexture(texture)) return false;
        return !!O.getMetadata(texture, GCC_TEXTURE_DESTROYED);
    }

    export function getNewGCCTexture(texture: PIXI.RenderTexture): PIXI.RenderTexture {
        let key = O.getMetadata(texture, GCC_TEXTURE_KEY) as string;
        let textureFactory = O.getMetadata(texture, GCC_TEXTURE_FACTORY) as () => PIXI.RenderTexture;
        return getOrCacheTexture(key, textureFactory);
    }

    function createTexture(key: string, textureFactory: () => PIXI.RenderTexture) {
        let texture = textureFactory();
        O.putMetadata(texture, GCC_TEXTURE_KEY, key);
        O.putMetadata(texture, GCC_TEXTURE_FACTORY, textureFactory);
        return texture;
    }
}