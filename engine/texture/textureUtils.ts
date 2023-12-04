/// <reference path="../utils/rectangle.ts" />

namespace TextureUtils {
    export type ExtendMode = 'transparent' | 'clamp';

    export type Subdivision = {
        x: number;
        y: number;
        texture: PIXI.RenderTexture;
    }

    export type TransformProperties = {
        scaleX?: number;
        scaleY?: number;
        tint?: number;
        alpha?: number;
        filters?: TextureFilter[];
    }

    /**
     * Returns a NEW texture which is a cropped version of the original.
     */
    export function crop(texture: PIXI.Texture, rect: Rect, source: string) {
        let sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0, 0);
        sprite.x = -rect.x;
        sprite.y = -rect.y;

        let result = newPixiRenderTexture(Math.floor(rect.width), Math.floor(rect.height), source);
        renderToRenderTexture(sprite, result);

        result.defaultAnchor.set(texture.defaultAnchor.x, texture.defaultAnchor.y);

        return result;
    }

    export function getFilterArea$(texture: PIXI.Texture, filters: TextureFilter[], x: number, y: number, scaleX: number, scaleY: number, angle: number) {
        let localBounds = TextureUtils.getTextureLocalBounds$(texture, x, y, scaleX, scaleY, angle);

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

    export function getTextureLocalBounds$(texture: PIXI.Texture, x: number, y: number, scaleX: number, scaleY: number, angle: number) {
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
        let ax = Math.floor(texture.defaultAnchor.x * texture.width) * scaleX;
        let ay = Math.floor(texture.defaultAnchor.y * texture.height) * scaleY;
        let rotatedAndScaled_ax = (-ax) * M.cos(angle) - (-ay) * M.sin(angle);
        let rotatedAndScaled_ay = (-ax) * M.sin(angle) + (-ay) * M.cos(angle);

        return FrameCache.rectangle(x + rotatedAndScaled_ax + minx, y + rotatedAndScaled_ay + miny, maxx - minx, maxy - miny);
    }

    export function isImmutable(renderTexture: PIXI.RenderTexture) {
        return O.getMetadata<boolean>(renderTexture, 'immutable') ?? false;
    }

    export function setImmutable(renderTexture: PIXI.RenderTexture) {
        O.putMetadata(renderTexture, 'immutable', true);
    }

    /**
     * Returns an array of NEW textures which are a subdivision of the original texture into h x v parts, along with their coordinates.
     */
    export function subdivide(texture: PIXI.Texture, h: number, v: number, source: string): Subdivision[] {
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
                    x: tx, y: ty,
                    texture: TextureUtils.crop(texture, rect(tx, ty, tw, th), source),
                });
            }
        }
        return result;
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
        if (properties.filters) sprite.filters = properties.filters;

        let result = newPixiRenderTexture(texture.width * Math.abs(scaleX), texture.height * Math.abs(scaleY), source);
        renderToRenderTexture(sprite, result);

        result.defaultAnchor.set(texture.defaultAnchor.x, texture.defaultAnchor.y);

        return result;
    }
}