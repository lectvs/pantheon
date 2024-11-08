namespace Utils {
    export const NOOP = () => null;
    export const IDENTITY = (e: any) => e;
    export const NOOP_DISPLAYOBJECT: PIXI.DisplayObject = new PIXI.DisplayObject();
    export const UID = new UIDGenerator();

    export function openTwitter() {
        window.open('https://twitter.com/lectvs', '_blank');
    }

    export function openBsky() {
        window.open('https://bsky.app/profile/lectvs.bsky.social', '_blank');
    }

    export function openDiscord() {
        window.open('https://discord.gg/qyG4xx45JD', '_blank');
    }
}

type KeyOfType<T, U> = {[P in keyof T]: T[P] extends U ? P: never}[keyof T]

function assertUnreachable(c: never) {
    console.error('Unreachable code reached for value:', c);
}

function async(fn: Function) {
    setTimeout(fn, 1);
}

function clearRenderTexture(renderTexture: PIXI.RenderTexture) {
    Main._internalClearRenderTexture(renderTexture);
    PerformanceTracking.logManualRender();
}

function freePixiRenderTexture(texture: PIXI.RenderTexture) {
    PerformanceTracking.logFreeTexture(texture);
    texture.destroy();
}

function newPixiRenderTexture(width: number, height: number, source: string) {
    // if (width > 2048 || height > 2048) {
    //     console.error(`Texture dimensions exceed bounds: (${width}, ${height}), limiting to bounds`);
    //     width = Math.min(width, 2048);
    //     height = Math.min(height, 2048);
    // }
    let texture = PIXI.RenderTexture.create({ width, height });
    PerformanceTracking.logCreateTexture(texture, source);
    return texture;
}

function renderToRenderTexture(object: PIXI.DisplayObject | PIXI.DisplayObject[], renderTexture: PIXI.RenderTexture, clearTextureFirst?: 'clearTextureFirst') {
    if (A.isArray(object)) {
        for (let i = 0; i < object.length; i++) {
            renderToRenderTexture(object[i], renderTexture, i === 0 ? clearTextureFirst : undefined);
        }
        return;
    }
    
    Main._internalRenderToRenderTexture(object, renderTexture, clearTextureFirst === 'clearTextureFirst');
    PerformanceTracking.logManualRender();
}

function requireType<T>(param: T) {
    return param;
}
