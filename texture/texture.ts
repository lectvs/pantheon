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
        texture: Texture;
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
        renderTexture: PIXI.RenderTexture;
        offsetx: number;
        offsety: number;
    }

    export type BlendMode = typeof BlendModes.ADD;
    export const BlendModes = PIXI.BLEND_MODES;

    export type ExtendMode = 'transparent' | 'clamp';
}

interface Texture {
    readonly width: number;
    readonly height: number;

    immutable: boolean;

    clear(): void;
    clone(): Texture;
    free(): void;

    getLocalBounds(properties: Texture.Properties): Rect;

    getPixelAbsoluteARGB(x: number, y: number, extendMode?: Texture.ExtendMode): number;
    getPixelRelativeARGB(x: number, y: number, extendMode?: Texture.ExtendMode): number;
    getPixelsARGB(): number[][];

    renderTo(texture: Texture, properties?: Texture.Properties): void;
    renderPIXIDisplayObject(displayObject: PIXI.DisplayObject): void;

    subdivide(h: number, v: number): Texture.Subdivision[];

    toMask(): Texture.TextureToMask;

    transform(properties?: Texture.TransformProperties): Texture;
}

namespace Texture {
    const cache_filledCircle: Dict<BasicTexture> = {};
    export function filledCircle(radius: number, fillColor: number, fillAlpha: number = 1) {
        let key = `${radius},${fillColor},${fillAlpha}`;
        if (!cache_filledCircle[key]) {
            let result = new BasicTexture(radius*2, radius*2);
            Draw.circleSolid(result, radius, radius, radius, { color: fillColor, alpha: fillAlpha, thickness: 0 });
            result.immutable = true;
            cache_filledCircle[key] = result;
        }
        
        return cache_filledCircle[key];
    }

    const cache_filledRect: Dict<BasicTexture> = {};
    export function filledRect(width: number, height: number, fillColor: number, fillAlpha: number = 1) {
        let key = `${width},${height},${fillColor},${fillAlpha}`;
        if (!cache_filledRect[key]) {
            let result = new BasicTexture(width, height);
            Draw.fill(result, { color: fillColor, alpha: fillAlpha, thickness: 0 });
            result.immutable = true;
            cache_filledRect[key] = result;
        }
        return cache_filledRect[key];
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

    export function ninepatch(sourceTexture: Texture, innerRect: Rect, targetWidth: number, targetHeight: number, tiled: boolean = false) {
        let result = new BasicTexture(targetWidth, targetHeight);

        let remwidth = sourceTexture.width - (innerRect.x + innerRect.width);
        let remheight = sourceTexture.height - (innerRect.y + innerRect.height);

        let innerScaleX = (targetWidth - innerRect.x - remwidth) / (innerRect.width);
        let innerScaleY = (targetHeight - innerRect.y - remheight) / (innerRect.height);

        if (tiled) {
            let countX = Math.max(1, Math.floor(innerScaleX));
            let countY = Math.max(1, Math.floor(innerScaleY));
            let pieceScaleX = innerScaleX / countX;
            let pieceScaleY = innerScaleY / countY;

            // Center
            for (let i = 0; i < countX; i++) {
                for (let j = 0; j < countY; j++) {
                    sourceTexture.renderTo(result, { x: innerRect.x + i*innerRect.width*pieceScaleX, y: innerRect.y + j*innerRect.height*pieceScaleY, scaleX: pieceScaleX, scaleY: pieceScaleY, slice: rect(pieceScaleX * innerRect.x, pieceScaleY * innerRect.y, pieceScaleX * innerRect.width, pieceScaleY * innerRect.height) });
                }
            }

            // Edges
            for (let i = 0; i < countX; i++) {
                sourceTexture.renderTo(result, { x: innerRect.x + i*innerRect.width*pieceScaleX, y: 0, scaleX: pieceScaleX, slice: rect(pieceScaleX * innerRect.x, 0, pieceScaleX * innerRect.width, innerRect.y) });
                sourceTexture.renderTo(result, { x: innerRect.x + i*innerRect.width*pieceScaleX, y: targetHeight - remheight, scaleX: pieceScaleX, slice: rect(pieceScaleX * innerRect.x, innerRect.y + innerRect.width, pieceScaleX * innerRect.width, remheight) });
            }
            for (let j = 0; j < countY; j++) {
                sourceTexture.renderTo(result, { x: 0, y: innerRect.y + j*innerRect.height*pieceScaleY, scaleY: pieceScaleY, slice: rect(0, pieceScaleY * innerRect.y, innerRect.x, pieceScaleY * innerRect.height) });
                sourceTexture.renderTo(result, { x: targetWidth - remwidth, y: innerRect.y + j*innerRect.height*pieceScaleY, scaleY: pieceScaleY, slice: rect(innerRect.x + innerRect.width, pieceScaleY * innerRect.y, remwidth, pieceScaleY * innerRect.height) });
            }

        } else {
            // Center
            sourceTexture.renderTo(result, { x: innerRect.x, y: innerRect.y, scaleX: innerScaleX, scaleY: innerScaleY, slice: rect(innerScaleX * innerRect.x, innerScaleY * innerRect.y, innerScaleX * innerRect.width, innerScaleY * innerRect.height) });

            // Edges
            sourceTexture.renderTo(result, { x: innerRect.x, y: 0, scaleX: innerScaleX, slice: rect(innerScaleX * innerRect.x, 0, innerScaleX * innerRect.width, innerRect.y) });
            sourceTexture.renderTo(result, { x: innerRect.x, y: targetHeight - remheight, scaleX: innerScaleX, slice: rect(innerScaleX * innerRect.x, innerRect.y + innerRect.width, innerScaleX * innerRect.width, remheight) });
            sourceTexture.renderTo(result, { x: 0, y: innerRect.y, scaleY: innerScaleY, slice: rect(0, innerScaleY * innerRect.y, innerRect.x, innerScaleY * innerRect.height) });
            sourceTexture.renderTo(result, { x: targetWidth - remwidth, y: innerRect.y, scaleY: innerScaleY, slice: rect(innerRect.x + innerRect.width, innerScaleY * innerRect.y, remwidth, innerScaleY * innerRect.height) });
        }

        // Corners
        sourceTexture.renderTo(result, { x: 0, y: 0, slice: rect(0, 0, innerRect.x, innerRect.y) });
        sourceTexture.renderTo(result, { x: targetWidth - remwidth, y: 0, slice: rect(innerRect.x + innerRect.width, 0, remwidth, innerRect.y) });
        sourceTexture.renderTo(result, { x: 0, y: targetHeight - remheight, slice: rect(0, innerRect.y + innerRect.height, innerRect.x, remheight) });
        sourceTexture.renderTo(result, { x: targetWidth - remwidth, y: targetHeight - remheight, slice: rect(innerRect.x + innerRect.width, innerRect.y + innerRect.height, remwidth, remheight) });

        return result;
    }

    const cache_outlineRect: Dict<BasicTexture> = {};
    export function outlineRect(width: number, height: number, outlineColor: number, outlineAlpha: number = 1, outlineThickness: number = 1) {
        let key = `${width},${height},${outlineColor},${outlineAlpha},${outlineThickness}`;
        if (!cache_outlineRect[key]) {
            let result = new BasicTexture(width, height);
            Draw.rectangleOutline(result, 0, 0, width, height, Draw.ALIGNMENT_INNER, { color: outlineColor, alpha: outlineAlpha, thickness: outlineThickness });
            result.immutable = true;
            cache_outlineRect[key] = result;
        }
        return cache_outlineRect[key];
    }

    export function setFilterProperties(filter: TextureFilter, posx: number, posy: number, dimx: number, dimy: number) {
        filter.setTexturePosition(posx, posy);
        filter.setTextureDimensions(dimx, dimy);
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

    export const NONE = new EmptyTexture();
    export const EFFECT_ONLY = new BasicTexture(0, 0);
}