namespace Utils {
    export const NOOP = () => null;
    export const NOOP_DISPLAYOBJECT: PIXI.DisplayObject = new PIXI.DisplayObject();
    export const NOOP_RENDERTEXTURE = PIXI.RenderTexture.create({ width: 0, height: 0 });

    export const UID = new UIDGenerator();
}

function requireType<T>(param: T) {
    return param;
}

function async(fn: Function) {
    setTimeout(fn, 1);
}

type KeyOfType<T, U> = {[P in keyof T]: T[P] extends U ? P: never}[keyof T]