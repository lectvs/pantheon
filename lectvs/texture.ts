/// <reference path="textureFilter.ts"/>

namespace Texture {
    export type Properties = {
        x?: number;
        y?: number;
        scaleX?: number;
        scaleY?: number;
        angle?: number;
        tint?: number;
        alpha?: number;
        slice?: Rect;
        filters?: TextureFilter[];
    }

    export type Subdivision = {
        x: number;
        y: number;
        texture: Texture;
    }
}

class Texture {
    renderTextureSprite: Texture.PIXIRenderTextureSprite;
    get width() { return this.renderTextureSprite.width; }
    get height() { return this.renderTextureSprite.height; }

    // Note: if the anchor lies in the middle of a pixel, the texture will draw slightly weird.
    anchorX: number;
    anchorY: number;

    immutable: boolean;

    constructor(width: number, height: number, immutable: boolean = false) {
        this.renderTextureSprite = new Texture.PIXIRenderTextureSprite(width, height);
        this.anchorX = 0;
        this.anchorY = 0;
        this.immutable = immutable;
    }

    clear() {
        if (this.immutable) {
            debug('Cannot clear immutable texture!');
            return;
        }
        this.renderTextureSprite.clear();
    }

    clone() {
        let result = new Texture(this.width, this.height);
        result.render(this, {
            x: this.anchorX * this.width,
            y: this.anchorY * this.height,
        });
        result.anchorX = this.anchorX;
        result.anchorY = this.anchorY;
        return result;
    }

    flipX() {
        let result = new Texture(this.width, this.height);
        result.render(this, {
            x: (1-this.anchorX) * this.width,
            y: this.anchorY * this.height,
            scaleX: -1,
        });
        result.anchorX = this.anchorX;
        result.anchorY = this.anchorY;
        return result;
    }

    flipY() {
        let result = new Texture(this.width, this.height);
        result.render(this, {
            x: this.anchorX * this.width,
            y: (1-this.anchorY) * this.height,
            scaleY: -1,
        });
        result.anchorX = this.anchorX;
        result.anchorY = this.anchorY;
        return result;
    }

    free() {
        this.renderTextureSprite.renderTexture.destroy(true);
    }

    render(texture: Texture, properties?: Texture.Properties) {
        if (!texture) return;
        if (this.immutable) {
            debug('Cannot render to immutable texture!');
            return;
        }

        properties = this.setRenderTextureSpriteProperties(texture, properties);
        let allFilters = this.setRenderTextureSpriteFilters(texture, properties);
        this.renderDisplayObject(texture.renderTextureSprite);
        this.returnTextureFilters(allFilters);
    }

    renderDisplayObject(displayObject: PIXI.DisplayObject) {
        if (this.immutable) {
            debug('Cannot render to immutable texture!');
            return;
        }
        global.renderer.render(displayObject, this.renderTextureSprite.renderTexture, false);
    }

    subdivide(h: number, v: number, anchorX: number = 0, anchorY: number = 0): Texture.Subdivision[] {
        if (h <= 0 || v <= 0) return [];

        let result: Texture.Subdivision[] = [];

        let framew = Math.floor(this.width/h);
        let frameh = Math.floor(this.height/v);
        let lastframew = this.width - (h-1)*framew;
        let lastframeh = this.height - (v-1)*frameh;

        for (let y = 0; y < v; y++) {
            for (let x = 0; x < h; x++) {
                let tx = x * framew;
                let ty = y * frameh;
                let tw = x === h-1 ? lastframew : framew;
                let th = y === v-1 ? lastframeh : frameh;
                let texture = new Texture(tw, th);
                texture.render(this, {
                    x: this.anchorX * this.width - tx,
                    y: this.anchorY * this.height - ty,
                });
                texture.anchorX = anchorX;
                texture.anchorY = anchorY;
                result.push({
                    x: tx, y: ty,
                    texture: texture
                });
            }
        }
        return result;
    }

    tint(tint: number) {
        let result = new Texture(this.width, this.height);
        result.render(this, {
            x: this.anchorX * this.width,
            y: this.anchorY * this.height,
            tint: tint,
        });
        result.anchorX = this.anchorX;
        result.anchorY = this.anchorY;
        return result;
    }

    toMaskTexture() {
        return this.renderTextureSprite.renderTexture;
    }

    private getAllTextureFilters(texture: Texture, properties: Texture.Properties) {
        let allFilters: TextureFilter[] = [];
        let sliceRect = this.getSliceRect(texture, properties);

        if (properties.slice) {
            let sliceFilterPosX = texture.renderTextureSprite.x - texture.anchorX*sliceRect.width;
            let sliceFilterPosY = texture.renderTextureSprite.y - texture.anchorY*sliceRect.height;
            let sliceFilter = TextureFilter.SLICE(properties.slice);
            Texture.setFilterProperties(sliceFilter, sliceFilterPosX, sliceFilterPosY);
            allFilters.push(sliceFilter);
        }

        let filterPosX = properties.x - texture.anchorX*sliceRect.width;
        let filterPosY = properties.y - texture.anchorY*sliceRect.height;
        properties.filters.forEach(filter => filter && Texture.setFilterProperties(filter, filterPosX, filterPosY));
        allFilters.push(...properties.filters);

        return allFilters.filter(filter => filter && filter.enabled);
    }

    private getSliceRect(texture: Texture, properties: Texture.Properties) {
        return properties.slice || { x: 0, y: 0, width: texture.width, height: texture.height };
    }

    private returnTextureFilters(allFilters: TextureFilter[]) {
        allFilters.forEach(filter => filter.returnPixiFilter());
    }

    private setRenderTextureSpriteProperties(texture: Texture, properties: Texture.Properties) {
        if (!properties) properties = {};

        _.defaults(properties, {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            tint: 0xFFFFFF,
            alpha: 1,
            slice: undefined,
            filters: [],
        });

        let sliceRect = this.getSliceRect(texture, properties);

        // Position
        let afterSliceX = properties.x + texture.anchorX * texture.width - (sliceRect.x + texture.anchorX * sliceRect.width);
        let afterSliceY = properties.y + texture.anchorY * texture.height - (sliceRect.y + texture.anchorY * sliceRect.height);
        texture.renderTextureSprite.x = afterSliceX;
        texture.renderTextureSprite.y = afterSliceY;

        // Other values
        texture.renderTextureSprite.scale.x = properties.scaleX;
        texture.renderTextureSprite.scale.y = properties.scaleY;
        texture.renderTextureSprite.angle = properties.angle;
        texture.renderTextureSprite.tint = properties.tint;
        texture.renderTextureSprite.alpha = properties.alpha;

        // Anchor
        texture.renderTextureSprite.anchor.x = texture.anchorX;
        texture.renderTextureSprite.anchor.y = texture.anchorY;

        return properties;
    }

    private setRenderTextureSpriteFilters(texture: Texture, properties: Texture.Properties) {
        let allFilters = this.getAllTextureFilters(texture, properties);
        texture.renderTextureSprite.filters = allFilters.map(filter => filter.borrowPixiFilter());
        texture.renderTextureSprite.filterArea = new PIXI.Rectangle(0, 0, this.width, this.height);
        return allFilters;
    }

    private static setFilterProperties(filter: TextureFilter, posx: number, posy: number) {
        filter.setTexturePosition(posx, posy);
    }
}

namespace Texture {
    export function filledRect(width: number, height: number, fillColor: number, fillAlpha: number = 1) {
        let result = new Texture(width, height);
        Draw.fill(result, { color: fillColor, alpha: fillAlpha, thickness: 0 });
        return result;
    }

    export function fromPixiTexture(pixiTexture: PIXI.Texture) {
        let sprite = new PIXI.Sprite(pixiTexture);
        let texture = new Texture(pixiTexture.width, pixiTexture.height);
        texture.anchorX = pixiTexture.defaultAnchor.x;
        texture.anchorY = pixiTexture.defaultAnchor.y;
        sprite.x = texture.anchorX * texture.width;
        sprite.y = texture.anchorY * texture.height;
        texture.renderDisplayObject(sprite);
        texture.immutable = true;
        return texture;
    }

    export function none() {
        return new Texture(0, 0);
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

