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
}

class Texture {
    renderTextureSprite: Texture.PIXIRenderTextureSprite;
    get width() { return this.renderTextureSprite.width; }
    get height() { return this.renderTextureSprite.height; }
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
        result.render(this, { x: this.anchorX * this.width, y: this.anchorY * this.height });
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
        this.setRenderTextureSpriteProperties(texture, properties);
        this.renderDisplayObject(texture.renderTextureSprite);
    }

    renderDisplayObject(displayObject: PIXI.DisplayObject) {
        if (this.immutable) {
            debug('Cannot render to immutable texture!');
            return;
        }
        Main.renderer.render(displayObject, this.renderTextureSprite.renderTexture, false);
    }

    toMaskTexture() {
        return this.renderTextureSprite.renderTexture;
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

        let sliceRect = properties.slice || { x: 0, y: 0, width: texture.width, height: texture.height };

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

        // Filter values
        let allFilters: TextureFilter[] = [];

        if (properties.slice) {
            let sliceFilterPosX = texture.renderTextureSprite.x - texture.anchorX*sliceRect.width;
            let sliceFilterPosY = texture.renderTextureSprite.y - texture.anchorY*sliceRect.height;
            let sliceFilter = TextureFilter.SLICE(properties.slice);
            Texture.setFilterProperties(sliceFilter, this.width, this.height, sliceFilterPosX, sliceFilterPosY);
            allFilters.push(sliceFilter);
        }

        let filterPosX = properties.x - texture.anchorX*sliceRect.width;
        let filterPosY = properties.y - texture.anchorY*sliceRect.height;
        properties.filters.forEach(filter => filter && Texture.setFilterProperties(filter, this.width, this.height, filterPosX, filterPosY));
        allFilters.push(...properties.filters);

        texture.renderTextureSprite.filters = allFilters.filter(filter => filter && filter.enabled).map(filter => filter.getPixiFilter());
        texture.renderTextureSprite.filterArea = new PIXI.Rectangle(0, 0, this.width, this.height);

        // Anchor
        texture.renderTextureSprite.anchor.x = texture.anchorX;
        texture.renderTextureSprite.anchor.y = texture.anchorY;
    }

    private static setFilterProperties(filter: TextureFilter, width: number, height: number, posx: number, posy: number) {
        filter.setDimensions(width, height);
        filter.setTexturePosition(posx, posy);
        filter.setPixiUniforms();
    }
}

namespace Texture {
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
            Main.renderer.render(Utils.NOOP_DISPLAYOBJECT, this._renderTexture, true);
        }
        
        resize(width: number, height: number) {
            this._renderTexture.resize(width, height);
        }
    }
}

