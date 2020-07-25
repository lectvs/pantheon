/// <reference path="textureFilter.ts"/>

class BasicTexture implements Texture {
    get width() { return this.renderTextureSprite._renderTexture.width; }
    get height() { return this.renderTextureSprite._renderTexture.height; }

    immutable: boolean;

    renderTextureSprite: Texture.PIXIRenderTextureSprite;

    constructor(width: number, height: number, immutable: boolean = false) {
        this.renderTextureSprite = new Texture.PIXIRenderTextureSprite(width, height);
        this.immutable = immutable;
    }

    clear() {
        if (this.immutable) {
            error('Cannot clear immutable texture!');
            return;
        }
        this.renderTextureSprite.clear();
    }

    clone() {
        return this.transform();
    }

    free() {
        this.renderTextureSprite.renderTexture.destroy(true);
    }

    renderTo(texture: Texture, properties?: Texture.Properties) {
        if (!texture) return;
        if (texture.immutable) {
            error('Cannot render to immutable texture!');
            return;
        }

        properties = this.setRenderTextureSpriteProperties(properties);
        let allFilters = this.setRenderTextureSpriteFilters(texture, properties);
        texture.renderPIXIDisplayObject(this.renderTextureSprite);
        this.returnTextureFilters(allFilters);
    }

    renderPIXIDisplayObject(displayObject: PIXI.DisplayObject) {
        if (this.immutable) {
            error('Cannot render to immutable texture!');
            return;
        }
        global.renderer.render(displayObject, this.renderTextureSprite.renderTexture, false);
    }

    subdivide(h: number, v: number): Texture.Subdivision[] {
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
                let texture = new BasicTexture(tw, th);
                this.renderTo(texture, {
                    x: -tx,
                    y: -ty,
                });
                result.push({
                    x: tx, y: ty,
                    texture: texture
                });
            }
        }
        return result;
    }

    toMaskTexture() {
        return this.renderTextureSprite.renderTexture;
    }

    /**
     * Returns a NEW texture which is transformed from the original.
     */
    transform(properties: Texture.TransformProperties = {}) {
        _.defaults(properties, {
            scaleX: 1,
            scaleY: 1,
            tint: 0xFFFFFF,
            alpha: 1,
            filters: [],
        });

        let result = new BasicTexture(this.width * Math.abs(properties.scaleX), this.height * Math.abs(properties.scaleY));
        this.renderTo(result, {
            x: this.width/2 * (Math.abs(properties.scaleX) - properties.scaleX),
            y: this.height/2 * (Math.abs(properties.scaleY) - properties.scaleY),
            scaleX: properties.scaleX,
            scaleY: properties.scaleY,
            tint: properties.tint,
            alpha: properties.alpha,
            filters: properties.filters,
        });
        return result;
    }

    private getAllTextureFilters(properties: Texture.Properties) {
        let allFilters: TextureFilter[] = [];

        if (properties.slice) {
            let sliceFilterPosX = this.renderTextureSprite.x;
            let sliceFilterPosY = this.renderTextureSprite.y;
            let sliceFilter = TextureFilter.SLICE(properties.slice);
            Texture.setFilterProperties(sliceFilter, sliceFilterPosX, sliceFilterPosY);
            allFilters.push(sliceFilter);
        }

        let filterPosX = properties.x;
        let filterPosY = properties.y;
        properties.filters.forEach(filter => filter && Texture.setFilterProperties(filter, filterPosX, filterPosY));
        allFilters.push(...properties.filters);

        return allFilters.filter(filter => filter && filter.enabled);
    }

    private getSliceRect(properties: Texture.Properties) {
        return properties.slice ?? { x: 0, y: 0, width: this.width, height: this.height };
    }

    private returnTextureFilters(allFilters: TextureFilter[]) {
        allFilters.forEach(filter => filter.returnPixiFilter());
    }

    private setRenderTextureSpriteProperties(properties: Texture.Properties) {
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

        let sliceRect = this.getSliceRect(properties);

        // Position
        let afterSliceX = properties.x - sliceRect.x;
        let afterSliceY = properties.y - sliceRect.y;
        this.renderTextureSprite.x = afterSliceX;
        this.renderTextureSprite.y = afterSliceY;

        // Other values
        this.renderTextureSprite.scale.x = properties.scaleX;
        this.renderTextureSprite.scale.y = properties.scaleY;
        this.renderTextureSprite.angle = properties.angle;
        this.renderTextureSprite.tint = properties.tint;
        this.renderTextureSprite.alpha = properties.alpha;

        return properties;
    }

    private setRenderTextureSpriteFilters(destTexture: Texture, properties: Texture.Properties) {
        let allFilters = this.getAllTextureFilters(properties);
        this.renderTextureSprite.filters = allFilters.map(filter => filter.borrowPixiFilter());
        this.renderTextureSprite.filterArea = new PIXI.Rectangle(0, 0, destTexture.width, destTexture.height);
        return allFilters;
    }
}
