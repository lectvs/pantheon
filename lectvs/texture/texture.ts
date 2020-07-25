namespace Texture {
    export type Properties = {
        x?: number;
        y?: number;
        scaleX?: number;
        scaleY?: number;
        angle?: number;
        tint?: number;
        alpha?: number;
        // Slice currently only works with unscaled, unrotated textures. Undefined behavior otherwise.
        slice?: Rect;
        filters?: TextureFilter[];
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
}

interface Texture {
    readonly width: number;
    readonly height: number;

    immutable: boolean;

    clear(): void;
    clone(): Texture;
    free(): void;

    renderTo(texture: Texture, properties?: Texture.Properties): void;
    renderPIXIDisplayObject(displayObject: PIXI.DisplayObject): void;

    subdivide(h: number, v: number): Texture.Subdivision[];

    toMaskTexture(): PIXI.RenderTexture;

    transform(properties?: Texture.TransformProperties): Texture;
}

namespace Texture {
    export function filledRect(width: number, height: number, fillColor: number, fillAlpha: number = 1) {
        let result = new BasicTexture(width, height);
        Draw.fill(result, { color: fillColor, alpha: fillAlpha, thickness: 0 });
        return result;
    }

    export function fromPixiTexture(pixiTexture: PIXI.Texture) {
        let sprite = new PIXI.Sprite(pixiTexture);
        let texture = new AnchoredTexture(pixiTexture.width, pixiTexture.height);
        texture.anchorX = pixiTexture.defaultAnchor.x;
        texture.anchorY = pixiTexture.defaultAnchor.y;
        sprite.x = texture.anchorX * texture.width;
        sprite.y = texture.anchorY * texture.height;
        texture.renderPIXIDisplayObject(sprite);
        texture.immutable = true;
        return texture;
    }

    export function none() {
        return new BasicTexture(0, 0);
    }

    export function outlineRect(width: number, height: number, outlineColor: number, outlineAlpha: number = 1, outlineThickness = 1) {
        let result = new BasicTexture(width, height);
        Draw.rectangleOutline(result, 0, 0, width, height, Draw.ALIGNMENT_INNER, { color: outlineColor, alpha: outlineAlpha, thickness: outlineThickness });
        return result;
    }

    export function setFilterProperties(filter: TextureFilter, posx: number, posy: number) {
        filter.setTexturePosition(posx, posy);
    }

    export class PIXIRenderTextureSprite extends PIXI.Sprite {
        _renderTexture: PIXI.RenderTexture;
        get renderTexture() { return this._renderTexture; }
    
        constructor(width: number, height: number) {
            let renderTexture = PIXI.RenderTexture.create({ width, height });
            super(renderTexture);
            
            this._renderTexture = renderTexture;
        }
    
        clear() {
            global.renderer.render(Utils.NOOP_DISPLAYOBJECT, this._renderTexture, true);
        }
        
        resize(width: number, height: number) {
            this._renderTexture.resize(width, height);
        }
    }
}