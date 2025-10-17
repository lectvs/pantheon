namespace Utils {
    export const NOOP = () => null;
    export const IDENTITY = (e: any) => e;
    export const NOOP_DISPLAYOBJECT: PIXI.DisplayObject = new PIXI.DisplayObject();
    export const UID = new UIDGenerator(10_000);

    export function createGlobalGetterSetter<T>(name: string, get: Getter<T>, set: Setter<T>) {
        Object.defineProperty(window, name, { get, set });
    }

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

type KeyOfType<T, U> = {[P in keyof Required<T>]: Required<T>[P] extends U ? P : never}[keyof Required<T>]

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
    let textureCreationSource = TextureUtils.getTextureCreationSource(texture);
    PerformanceTracking.logFreeTexture(texture, textureCreationSource);
    Main._internalUnbindTexture(texture);
    Main._internalUnbindTexture(texture.baseTexture);
    texture.destroy(true);
}

function newPixiRenderTexture(width: number, height: number, source: string) {
    // if (width > 2048 || height > 2048) {
    //     console.error(`Texture dimensions exceed bounds: (${width}, ${height}), limiting to bounds`);
    //     width = Math.min(width, 2048);
    //     height = Math.min(height, 2048);
    // }
    let texture = PIXI.RenderTexture.create({ width, height });
    TextureUtils.setTextureCreationSource(texture, source);
    PerformanceTracking.logCreateTexture(texture, source);
    return texture;
}

function renderToRenderTexture(object: PIXI.DisplayObject | PIXI.DisplayObject[], renderTexture: PIXI.RenderTexture, clearTextureFirst?: 'clearTextureFirst') {
    if (A.isArray(object)) {
        let container = new PIXI.Container();
        for (let i = 0; i < object.length; i++) {
            container.addChild(object[i]);
        }
        renderToRenderTexture(container, renderTexture, clearTextureFirst);
        return;
    }
    
    Main._internalRenderToRenderTexture(object, renderTexture, clearTextureFirst === 'clearTextureFirst');
    PerformanceTracking.logManualRender();
}

function requireType<T>(param: T) {
    return param;
}
