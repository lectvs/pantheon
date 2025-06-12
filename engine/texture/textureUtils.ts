/// <reference path="../utils/o_object.ts" />
/// <reference path="../utils/rectangle.ts" />

namespace TextureUtils {
    export type ExtendMode = 'transparent' | 'clamp';

    export type Subdivision = {
        x: number;
        y: number;
        texture: PIXI.RenderTexture;
    }

    export type RenderProperties = {
        x?: number;
        y?: number;
        scaleX?: number;
        scaleY?: number;
        tint?: number;
        alpha?: number;
        filters?: TextureFilter[];
    }

    export type TransformProperties = {
        scaleX?: number;
        scaleY?: number;
        tint?: number;
        alpha?: number;
        filters?: TextureFilter[];
    }

    export type TextureLike = {
        width: number;
        height: number;
        defaultAnchor: Pt;
    }

    /**
     * Returns a NEW texture which is a cropped version of the original.
     */
    export function crop(texture: PIXI.Texture, rect: Rect, source: string, anchor?: Vector2) {
        let sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0, 0);
        sprite.x = -rect.x;
        sprite.y = -rect.y;

        let result = newPixiRenderTexture(Math.floor(rect.width), Math.floor(rect.height), source);
        renderToRenderTexture(sprite, result);

        let resultAnchor = anchor ?? texture.defaultAnchor;
        result.defaultAnchor.set(resultAnchor.x, resultAnchor.y);

        return result;
    }

    export function getFilterArea$(texture: PIXI.Texture, filters: TextureFilter[], x: number, y: number, scaleX: number, scaleY: number, angle: number, overrideAnchor: Pt | undefined) {
        let localBounds = TextureUtils.getTextureLocalBounds$(texture, x, y, scaleX, scaleY, angle, overrideAnchor);

        if (!localBounds.isFinite()) {
            return undefined;
        }

        if (!A.isEmpty(filters)) {
            for (let filter of filters) {
                let visualPadding = filter.getVisualPadding();
                if (!isFinite(visualPadding)) return undefined;
                localBounds.x -= visualPadding;
                localBounds.y -= visualPadding;
                localBounds.width += 2*visualPadding;
                localBounds.height += 2*visualPadding;
            }
        }

        return localBounds;
    }

    export function getPixelARGBRawPos(texture: PIXI.Texture, x: number, y: number, extendMode: ExtendMode = 'transparent') {
        if (texture.width === 0 || texture.height === 0) return 0x00000000

        let pixels = getPixelsARGB(texture);

        x = Math.round(x);
        y = Math.round(y);

        if (extendMode === 'transparent') {
            if (x < 0 || x >= pixels[0].length || y < 0 || y >= pixels.length) return 0x00000000;
        } else if (extendMode === 'clamp') {
            x = M.clamp(x, 0, pixels[0].length);
            y = M.clamp(y, 0, pixels.length);
        }

        return pixels[y][x];
    }

    export function getPixelARGBAnchorPos(texture: PIXI.Texture, x: number, y: number, extendMode: ExtendMode = 'transparent') {
        return getPixelARGBRawPos(texture, x + texture.defaultAnchor.x * texture.width, y + texture.defaultAnchor.y * texture.height, extendMode);
    }

    export function getPixelsARGB(texture: PIXI.Texture) {
        let isImmutable = !(texture instanceof PIXI.RenderTexture) || TextureUtils.isImmutable(texture);
        let cachedPixelsARGB = O.getMetadata<number[][]>(texture, 'cachedPixelsARGB');
        if (isImmutable && cachedPixelsARGB) return cachedPixelsARGB;

        let pixels = Main.rendererPlugins.extract.pixels(new PIXI.Sprite(texture));

        let result: number[][] = [];
        for (let y = 0; y < texture.height; y++) {
            let line: number[] = [];
            for (let x = 0; x < texture.width; x++) {
                let i = x + y * texture.width;
                let r = pixels[4*i + 0];
                let g = pixels[4*i + 1];
                let b = pixels[4*i + 2];
                let a = pixels[4*i + 3];

                let color = (a << 24 >>> 0) + (r << 16) + (g << 8) + b;
                line.push(color);
            }
            result.push(line);
        }

        if (isImmutable) {
            O.putMetadata(texture, 'cachedPixelsARGB', result);
        }
        return result;
    }

    export function getTextureCreationSource(renderTexture: PIXI.RenderTexture) {
        return O.getMetadata<string>(renderTexture, 'textureCreationSource') ?? undefined;
    }

    export function getTextureLocalBounds$(texture: TextureLike, x: number, y: number, scaleX: number, scaleY: number, angle: number, overrideAnchor: Pt | undefined) {
        let width = texture.width * scaleX;
        let height = texture.height * scaleY;

        let v1x = 0;
        let v1y = 0;
        let v2x = width * M.cos(angle);
        let v2y = width * M.sin(angle);
        let v3x = -height * M.sin(angle);
        let v3y = height * M.cos(angle);
        let v4x = v2x + v3x;
        let v4y = v2y + v3y;

        let minx = Math.min(v1x, v2x, v3x, v4x);
        let maxx = Math.max(v1x, v2x, v3x, v4x);
        let miny = Math.min(v1y, v2y, v3y, v4y);
        let maxy = Math.max(v1y, v2y, v3y, v4y);

        // Anchor adjustment
        let anchorX = overrideAnchor ? overrideAnchor.x : texture.defaultAnchor.x;
        let anchorY = overrideAnchor ? overrideAnchor.y : texture.defaultAnchor.y;
        let ax = Math.floor(anchorX * texture.width) * scaleX;
        let ay = Math.floor(anchorY * texture.height) * scaleY;
        let rotatedAndScaled_ax = (-ax) * M.cos(angle) - (-ay) * M.sin(angle);
        let rotatedAndScaled_ay = (-ax) * M.sin(angle) + (-ay) * M.cos(angle);

        return FrameCache.rectangle(x + rotatedAndScaled_ax + minx, y + rotatedAndScaled_ay + miny, maxx - minx, maxy - miny);
    }

    export function isDestroyed(texture: PIXI.Texture) {
        return !!texture.orig;
    }

    export function isImmutable(renderTexture: PIXI.RenderTexture) {
        return O.getMetadata<boolean>(renderTexture, 'immutable') ?? false;
    }

    /**
     * Renders a texture to another texture.
     */
    export function render(texture: PIXI.Texture, toTexture: PIXI.RenderTexture, properties: RenderProperties = {}) {
        if (isImmutable(toTexture)) {
            console.error('Cannot render to immutable texture:', toTexture);
            return;
        }
        renderSprite.texture = texture;
        renderSprite.anchor.set(texture.defaultAnchor.x, texture.defaultAnchor.y);
        renderSprite.x = properties.x ?? 0;
        renderSprite.y = properties.y ?? 0;
        renderSprite.scale.x = properties.scaleX ?? 1;
        renderSprite.scale.y = properties.scaleY ?? 1;
        renderSprite.tint = properties.tint ?? 0xFFFFFF;
        renderSprite.alpha = properties.alpha ?? 1;

        let effects = new Effects();
        if (properties.filters) {
            effects.post = properties.filters;
        }
        renderSprite.updateAndSetEffects(effects);

        renderToRenderTexture(renderSprite, toTexture);
    }
    const renderSprite = new PIXI.Sprite();

    export function setImmutable(renderTexture: PIXI.RenderTexture) {
        O.putMetadata(renderTexture, 'immutable', true);
    }

    export function setTextureCreationSource(texture: PIXI.RenderTexture, source: string) {
        O.putMetadata(texture, 'textureCreationSource', source);
        O.putMetadata(texture.baseTexture, 'textureCreationSource', source);
    }

    /**
     * Returns an array of NEW textures which are a subdivision of the original texture into h x v parts, along with their coordinates.
     */
    export function subdivide(texture: PIXI.Texture, h: number, v: number, anchor: Vector2, source: string): Subdivision[] {
        if (h <= 0 || v <= 0) return [];

        let result: Subdivision[] = [];

        let framew = Math.floor(texture.width/h);
        let frameh = Math.floor(texture.height/v);
        let lastframew = texture.width - (h-1)*framew;
        let lastframeh = texture.height - (v-1)*frameh;

        for (let y = 0; y < v; y++) {
            for (let x = 0; x < h; x++) {
                let tx = x * framew;
                let ty = y * frameh;
                let tw = x === h-1 ? lastframew : framew;
                let th = y === v-1 ? lastframeh : frameh;
                result.push({
                    x: tx + anchor.x * tw,
                    y: ty + anchor.y * th,
                    texture: TextureUtils.crop(texture, rect(tx, ty, tw, th), source, anchor),
                });
            }
        }
        return result;
    }

    const superTextureCache: Dict<PIXI.Texture> = {};
    export function superTexture(...textureKeys: string[]) {
        let cacheKey = textureKeys.join(':+:');
        if (!(cacheKey in superTextureCache)) {
            let textures = textureKeys.map(key => AssetCache.getTexture(key));
            let width = M.max(textures, t => t.width);
            let height = M.max(textures, t => t.height);
            let finalTexture = newPixiRenderTexture(width, height, 'TextureUtils.superTexture');
            let sprite = new PIXI.Sprite();
            for (let t of textures) {
                sprite.texture = t;
                sprite.anchor.set(0, 0);
                renderToRenderTexture(sprite, finalTexture);
            }
            finalTexture.defaultAnchor.x = textures[0].defaultAnchor.x;
            finalTexture.defaultAnchor.y = textures[0].defaultAnchor.y;
            setImmutable(finalTexture);
            superTextureCache[cacheKey] = finalTexture;
        }
        return superTextureCache[cacheKey];
    }

    export function toCanvas(renderTexture: PIXI.RenderTexture) {
        return Main.rendererPlugins.extract.canvas(renderTexture);
    }

    /**
     * Returns a NEW texture which is transformed from the original.
     */
    export function transform(texture: PIXI.Texture, properties: TransformProperties, source: string) {
        let scaleX = properties.scaleX ?? 1;
        let scaleY = properties.scaleY ?? 1;

        let sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0, 0);
        sprite.x = texture.width/2 * (Math.abs(scaleX) - scaleX);
        sprite.y = texture.height/2 * (Math.abs(scaleY) - scaleY);
        sprite.scale.set(scaleX, scaleY);
        sprite.tint = properties.tint ?? 0xFFFFFF;
        sprite.alpha = properties.alpha ?? 1;
        sprite.updateAndSetEffects(new Effects({ post: properties.filters }));

        let result = newPixiRenderTexture(texture.width * Math.abs(scaleX), texture.height * Math.abs(scaleY), source);
        renderToRenderTexture(sprite, result);

        result.defaultAnchor.set(texture.defaultAnchor.x, texture.defaultAnchor.y);

        return result;
    }
}