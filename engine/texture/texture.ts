namespace Texture {
    export type Properties = {
        x?: number;
        y?: number;
        scaleX?: number;
        scaleY?: number;
        angle?: number;
        tint?: number;
        alpha?: number;
        slice?: Rect;  // Slice currently only works with unscaled, unrotated textures. Undefined behavior otherwise.
        mask?: MaskProperties;
        filters?: TextureFilter[];
        blendMode?: BlendMode;
    }
    
    export type MaskProperties = {
        texture: PIXI.Texture;
        x: number;
        y: number;
        invert: boolean;
    }

    export type Subdivision = {
        x: number;
        y: number;
        texture: Texture;
    }

    export type TransformProperties = {
        scaleX?: number;
        scaleY?: number;
        tint?: number;
        alpha?: number;
        filters?: TextureFilter[];
    }

    export type TextureToMask = {
        renderTexture: PIXI.Texture;
        offsetx: number;
        offsety: number;
    }

    export type BlendMode = PIXI.BLEND_MODES;
    export const BlendModes = PIXI.BLEND_MODES;

    export type ExtendMode = 'transparent' | 'clamp';
}

interface Texture {
    readonly width: number;
    readonly height: number;

    immutable: boolean;

    clear(): void;
    clone(source: string): Texture;
    crop(x: number, y: number, width: number, height: number, source: string): Texture;
    free(): void;

    getLocalBounds$(properties: Texture.Properties): Rectangle;

    getPixelAbsoluteARGB(x: number, y: number, extendMode?: Texture.ExtendMode): number;
    getPixelRelativeARGB(x: number, y: number, extendMode?: Texture.ExtendMode): number;
    getPixelsARGB(): number[][];

    // TODO PIXI
    getPixiTexture(): PIXI.Texture;
    getPixiTextureAnchorX(): number;
    getPixiTextureAnchorY(): number;

    renderTo(texture: Texture, properties?: Texture.Properties): void;
    renderPIXIDisplayObject(displayObject: PIXI.DisplayObject): void;

    subdivide(h: number, v: number, source: string): Texture.Subdivision[];

    toCanvas(): HTMLCanvasElement;
    toMask(): Texture.TextureToMask;

    transform(properties: Texture.TransformProperties, source: string): Texture;
}

namespace Texture {
    export function fromPixiTexture(pixiTexture: PIXI.Texture) {
        let sprite = new PIXI.Sprite(pixiTexture);
        let texture = new AnchoredTexture(new BasicTexture(pixiTexture.width, pixiTexture.height, 'Texture.fromPixiTexture'));
        texture.anchorX = pixiTexture.defaultAnchor.x;
        texture.anchorY = pixiTexture.defaultAnchor.y;
        sprite.x = texture.anchorX * texture.width;
        sprite.y = texture.anchorY * texture.height;
        texture.renderPIXIDisplayObject(sprite);
        texture.immutable = true;
        return texture;
    }

    export function setFilterProperties(filter: TextureFilter, posx: number, posy: number, dimx: number, dimy: number) {
        filter.setTexturePosition(posx, posy);
        filter.setTextureDimensions(dimx, dimy);
    }

    export class PIXIRenderTextureSprite extends PIXI.Sprite {
        _renderTexture: PIXI.RenderTexture;
        get renderTexture() { return this._renderTexture; }
    
        constructor(width: number, height: number, source: string) {
            let renderTexture = newPixiRenderTexture(width, height, source);
            super(renderTexture);
            
            this._renderTexture = renderTexture;
        }
    
        clear() {
            global.renderer.render(Utils.NOOP_DISPLAYOBJECT, this._renderTexture, true);
        }

        free() {
            freePixiRenderTexture(this.renderTexture);
        }
        
        resize(width: number, height: number) {
            this._renderTexture.resize(width, height);
        }
    }
}