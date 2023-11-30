namespace TextureCreationData {
    export const TEXTURES_CREATED: Dict<number> = {};
    export var TEXTURES_FREED: number = 0;

    export function logCreateTexture(texture: PIXI.RenderTexture, source: string) {
        TEXTURES_CREATED[source] = (TEXTURES_CREATED[source] || 0) + 1;
    }

    export function logFreeTexture(texture: PIXI.RenderTexture) {
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

function newPixiRenderTexture(width: number, height: number, source: string) {
    let texture = PIXI.RenderTexture.create({ width, height });
    TextureCreationData.logCreateTexture(texture, source);
    return texture;
}

function freePixiRenderTexture(texture: PIXI.RenderTexture) {
    TextureCreationData.logFreeTexture(texture);
    texture.destroy();
}