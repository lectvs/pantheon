class EmptyTexture implements Texture {
    get width() { return 0; }
    get height() { return 0; }

    get immutable() { return true; }

    constructor() {

    }

    clear() { }

    clone() {
        return new EmptyTexture();
    }

    free() { }
    renderTo(texture: Texture, properties: Texture.Properties = {}) { }
    renderPIXIDisplayObject(displayObject: PIXI.DisplayObject) { }

    subdivide(h: number, v: number) {
        let result: Texture.Subdivision[] = [];
        for (let i = 0; i < h*v; i++) {
            result.push({
                texture: new EmptyTexture(),
                x: 0, y: 0,
            });
        }
        return result;
    }

    toMask() {
        return {
            renderTexture: Utils.NOOP_RENDERTEXTURE,
            offsetx: 0, offsety: 0,
        };
    }

    transform(properties?: Texture.TransformProperties) {
        return new EmptyTexture();
    }
}
