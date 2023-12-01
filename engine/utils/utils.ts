namespace Utils {
    export const NOOP = () => null;
    export const NOOP_DISPLAYOBJECT: PIXI.DisplayObject = new PIXI.DisplayObject();

    export const UID = new UIDGenerator();
}

type KeyOfType<T, U> = {[P in keyof T]: T[P] extends U ? P: never}[keyof T]

function assertUnreachable(c: never) {
    console.error("Unreachable code reached!");
}

function async(fn: Function) {
    setTimeout(fn, 1);
}

function clearRenderTexture(renderTexture: PIXI.RenderTexture) {
    Main._internalClearRenderTexture(renderTexture);
    PerformanceTracking.logManualRender();
}

function newPixiRenderTexture(width: number, height: number, source: string) {
    let texture = PIXI.RenderTexture.create({ width, height });
    PerformanceTracking.logCreateTexture(texture, source);
    return texture;
}

function freePixiRenderTexture(texture: PIXI.RenderTexture) {
    PerformanceTracking.logFreeTexture(texture);
    texture.destroy();
}

function renderToRenderTexture(object: PIXI.DisplayObject, renderTexture: PIXI.RenderTexture, clearTextureFirst?: 'clearTextureFirst') {
    Main._internalRenderToRenderTexture(object, renderTexture, clearTextureFirst === 'clearTextureFirst');
    PerformanceTracking.logManualRender();
}

function requireType<T>(param: T) {
    return param;
}
