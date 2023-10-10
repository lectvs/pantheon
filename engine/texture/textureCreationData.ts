namespace TextureCreationData {
    export const TEXTURES_CREATED: Dict<number> = {};
    export var TEXTURES_FREED: number = 0;

    export function logCreateTexture(texture: Texture, source: string) {
        TEXTURES_CREATED[source] = (TEXTURES_CREATED[source] || 0) + 1;
    }

    export function logFreeTexture(texture: Texture) {
        TEXTURES_FREED++;
    }

    export function getTotalTexturesCreated() {
        let total = 0;
        for (let key in TEXTURES_CREATED) {
            total += TEXTURES_CREATED[key];
        }
        return total;
    }

    export function getTotalTexturesCreatedAndNotFreed() {
        return getTotalTexturesCreated() - TEXTURES_FREED;
    }
}