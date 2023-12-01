namespace PerformanceTracking {
    export const TEXTURES_CREATED: Dict<number> = {};
    export var TEXTURES_FREED: number = 0;
    export var MANUAL_RENDERS: number[] = [];

    export function logBeginFrame() {
        MANUAL_RENDERS.unshift(0);
        while (MANUAL_RENDERS.length > 1000) {
            MANUAL_RENDERS.pop();
        }
    }

    export function logCreateTexture(texture: PIXI.RenderTexture, source: string) {
        TEXTURES_CREATED[source] = (TEXTURES_CREATED[source] || 0) + 1;
    }

    export function logFreeTexture(texture: PIXI.RenderTexture) {
        TEXTURES_FREED++;
    }

    export function logManualRender() {
        MANUAL_RENDERS[0]++;
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