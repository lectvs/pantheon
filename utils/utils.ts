namespace Utils {
    export const NOOP = () => null;
    export const NOOP_DISPLAYOBJECT: PIXI.DisplayObject = new PIXI.DisplayObject();
    export const NOOP_RENDERTEXTURE = PIXI.RenderTexture.create({ width: 0, height: 0 });

    export const UID = new UIDGenerator();
}

function requireType<T>(param: T) {
    return param;
}
