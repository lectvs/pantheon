namespace PerformanceTracking {
    export const TEXTURES_CREATED_AND_NOT_FREED: Dict<number> = {};
    export const SPRITE_TEXT_STATIC_TEXTURES_BORROWED_AND_NOT_RETURNED: Dict<number> = {};

    export var MANUAL_RENDERS: number[] = [];

    export function logBeginFrame() {
        MANUAL_RENDERS.unshift(0);
        while (MANUAL_RENDERS.length > 1000) {
            MANUAL_RENDERS.pop();
        }
    }

    export function logCreateTexture(texture: PIXI.RenderTexture, source: string) {
        TEXTURES_CREATED_AND_NOT_FREED[source] = (TEXTURES_CREATED_AND_NOT_FREED[source] || 0) + 1;
    }

    export function logFreeTexture(texture: PIXI.RenderTexture, source: string | undefined) {
        if (!source || !(source in TEXTURES_CREATED_AND_NOT_FREED)) {
            console.error('Freed a texture which was not allocated in PerformanceTracking', source, texture);
            return;
        }
        TEXTURES_CREATED_AND_NOT_FREED[source]--;
        if (TEXTURES_CREATED_AND_NOT_FREED[source] === 0) {
            delete TEXTURES_CREATED_AND_NOT_FREED[source];
        }
    }

    export function logBorrowSpriteTextStaticTexture(texture: PIXI.RenderTexture, source: string) {
        SPRITE_TEXT_STATIC_TEXTURES_BORROWED_AND_NOT_RETURNED[source] = (SPRITE_TEXT_STATIC_TEXTURES_BORROWED_AND_NOT_RETURNED[source] || 0) + 1;
    }

    export function logReturnSpriteTextStaticTexture(texture: PIXI.RenderTexture, source: string) {
        if (!(source in SPRITE_TEXT_STATIC_TEXTURES_BORROWED_AND_NOT_RETURNED)) {
            console.error('Returned a SpriteText static texture that was never borrowed', source, texture);
            return;
        }
        SPRITE_TEXT_STATIC_TEXTURES_BORROWED_AND_NOT_RETURNED[source]--;
        if (SPRITE_TEXT_STATIC_TEXTURES_BORROWED_AND_NOT_RETURNED[source] === 0) {
            delete SPRITE_TEXT_STATIC_TEXTURES_BORROWED_AND_NOT_RETURNED[source];
        }
    }

    export function logManualRender() {
        MANUAL_RENDERS[0]++;
    }

    export function getTotalTexturesCreatedAndNotFreed() {
        let total = 0;
        for (let key in TEXTURES_CREATED_AND_NOT_FREED) {
            total += TEXTURES_CREATED_AND_NOT_FREED[key];
        }
        return total;
    }

    export function getTotalSpriteTextStaticTexturesBorrowedAndNotReturned() {
        let total = 0;
        for (let key in SPRITE_TEXT_STATIC_TEXTURES_BORROWED_AND_NOT_RETURNED) {
            total += SPRITE_TEXT_STATIC_TEXTURES_BORROWED_AND_NOT_RETURNED[key];
        }
        return total;
    }
}