/// <reference path="../utils/performanceTracking.ts" />

namespace Textures {
    export const NONE = PIXI.Texture.EMPTY;
    export const NOOP = newPixiRenderTexture(0, 0, 'Textures.NOOP');
    
    const cache_filledCircle: Dict<PIXI.RenderTexture> = {};
    export function filledCircle(radius: number, fillColor: number, fillAlpha: number = 1) {
        let key = `${radius},${fillColor},${fillAlpha}`;
        if (!cache_filledCircle[key]) {
            let result = newPixiRenderTexture(radius*2, radius*2, 'Textures.filledCircle');
            result.defaultAnchor.set(0.5, 0.5);
            Draw.circle(result, radius, radius, radius, { fill: { color: fillColor, alpha: fillAlpha }});
            TextureUtils.setImmutable(result);
            cache_filledCircle[key] = result;
        }
        
        return cache_filledCircle[key];
    }

    const cache_filledRect: Dict<PIXI.RenderTexture> = {};
    export function filledRect(width: number, height: number, fillColor: number, fillAlpha: number = 1) {
        let key = `${width},${height},${fillColor},${fillAlpha}`;
        if (!cache_filledRect[key]) {
            let result = newPixiRenderTexture(width, height, 'Textures.filledRect');
            Draw.rectangle(result, 0, 0, width, height, { fill: { color: fillColor, alpha: fillAlpha }});
            TextureUtils.setImmutable(result);
            cache_filledRect[key] = result;
        }
        
        return cache_filledRect[key];
    }

    const cache_filledRoundedRect: Dict<PIXI.RenderTexture> = {};
    export function filledRoundedRect(width: number, height: number, radius: number, fillColor: number, fillAlpha: number = 1) {
        let key = `${width},${height},${radius},${fillColor},${fillAlpha}`;
        if (!cache_filledRoundedRect[key]) {
            let result = newPixiRenderTexture(width, height, 'Textures.filledRoundedRect');
            Draw.roundedRectangle(result, 0, 0, width, height, radius, { fill: { color: fillColor, alpha: fillAlpha }});
            TextureUtils.setImmutable(result);
            cache_filledRoundedRect[key] = result;
        }

        return cache_filledRoundedRect[key];
    }

    const cache_filledPolygon: Dict<PIXI.RenderTexture> = {};
    export function filledPolygon(points: Pt[], fillColor: number, fillAlpha: number = 1) {
        let key = `[${points.map(p => `${p.x},${p.y}`).join(',')}].${fillColor},${fillAlpha}`;
        if (!cache_filledPolygon[key]) {
            let boundaries = G.getEncompassingBoundaries$(points);
            let result = newPixiRenderTexture(Math.floor(boundaries.width)+1, Math.floor(boundaries.height)+1, 'Textures.filledPolygon');
            result.defaultAnchor.set(0.5, 0.5);
            Draw.polygon(result, points.map(p => vec2(p.x - boundaries.left, p.y - boundaries.top)), { fill: { color: fillColor, alpha: fillAlpha }});
            TextureUtils.setImmutable(result);
            cache_filledPolygon[key] = result;

        }
        return cache_filledPolygon[key];
    }

    const cache_outlineRect: Dict<PIXI.RenderTexture> = {};
    export function outlineRect(width: number, height: number, outlineColor: number, outlineAlpha: number = 1, outlineThickness: number = 1) {
        let key = `${width},${height},${outlineColor},${outlineAlpha},${outlineThickness}`;
        if (!cache_outlineRect[key]) {
            let result = newPixiRenderTexture(width, height, 'Textures.outlineRect');
            Draw.rectangle(result, 0, 0, width, height, { outline: { color: outlineColor, alpha: outlineAlpha, thickness: outlineThickness }});
            TextureUtils.setImmutable(result);
            cache_outlineRect[key] = result;
        }
        return cache_outlineRect[key];
    }

    const cache_outlineRoundedRect: Dict<PIXI.RenderTexture> = {};
    export function outlineRoundedRect(width: number, height: number, radius: number, outlineColor: number, outlineAlpha: number = 1, outlineThickness: number = 1) {
        let key = `${width},${height},${radius},${outlineColor},${outlineAlpha},${outlineThickness}`;
        if (!cache_outlineRoundedRect[key]) {
            let result = newPixiRenderTexture(width, height, 'Textures.outlineRoundedRect');
            Draw.roundedRectangle(result, 0, 0, width, height, radius, { outline: { color: outlineColor, alpha: outlineAlpha, thickness: outlineThickness }});
            TextureUtils.setImmutable(result);
            cache_outlineRoundedRect[key] = result;
        }

        return cache_outlineRoundedRect[key];
    }

    const cache_outlineCircle: Dict<PIXI.RenderTexture> = {};
    export function outlineCircle(radius: number, outlineColor: number, outlineAlpha: number = 1, outlineThickness: number = 1) {
        let key = `${radius},${outlineColor},${outlineAlpha},${outlineThickness}`;
        if (!cache_outlineCircle[key]) {
            let result = newPixiRenderTexture(radius*2, radius*2, 'Textures.outlineCircle');
            result.defaultAnchor.set(0.5, 0.5);
            Draw.circle(result, radius, radius, radius, { outline: { color: outlineColor, alpha: outlineAlpha, thickness: outlineThickness }});
            TextureUtils.setImmutable(result);
            cache_outlineCircle[key] = result;
        }
        return cache_outlineCircle[key];
    }

    const cache_outlinePolygon: Dict<PIXI.RenderTexture> = {};
    export function outlinePolygon(points: Pt[], outlineColor: number, outlineAlpha: number = 1, outlineThickness: number = 1) {
        let key = `[${points.map(p => `${p.x},${p.y}`).join(',')}].${outlineColor},${outlineAlpha},${outlineThickness}`;
        if (!cache_outlinePolygon[key]) {
            let boundaries = G.getEncompassingBoundaries$(points);
            let alignment: 'inner' | 'outer' = G.chirality(points) >= 0 ? 'inner' : 'outer';
            let result = newPixiRenderTexture(Math.floor(boundaries.width)+1, Math.floor(boundaries.height)+1, 'Textures.outlinePolygon');
            result.defaultAnchor.set(0.5, 0.5);
            Draw.polygon(result, points.map(p => vec2(p.x - boundaries.left, p.y - boundaries.top)), { outline: { color: outlineColor, alpha: outlineAlpha, thickness: outlineThickness, alignment }});
            TextureUtils.setImmutable(result);
            cache_outlinePolygon[key] = result;

        }
        return cache_outlinePolygon[key];
    }

    const cache_ninepatchScaled: Dict<PIXI.RenderTexture> = {};
    export function ninepatchScaled(baseTexture: string, width: number, height: number) {
        let key = `${baseTexture},${width},${height}`;
        if (!cache_ninepatchScaled[key]) {
            let result = newPixiRenderTexture(width, height, 'Textures.ninepatchScaled');
            result.defaultAnchor.copyFrom(AssetCache.getTexture(baseTexture).defaultAnchor);

            let topleft = AssetCache.getTexture(`${baseTexture}/ninepatch/topleft`);
            let top = AssetCache.getTexture(`${baseTexture}/ninepatch/top`);
            let topright = AssetCache.getTexture(`${baseTexture}/ninepatch/topright`);
            let left = AssetCache.getTexture(`${baseTexture}/ninepatch/left`);
            let center = AssetCache.getTexture(`${baseTexture}/ninepatch/center`);
            let right = AssetCache.getTexture(`${baseTexture}/ninepatch/right`);
            let bottomleft = AssetCache.getTexture(`${baseTexture}/ninepatch/bottomleft`);
            let bottom = AssetCache.getTexture(`${baseTexture}/ninepatch/bottom`);
            let bottomright = AssetCache.getTexture(`${baseTexture}/ninepatch/bottomright`);

            // Corners
            TextureUtils.render(topleft, result, { x: 0, y: 0 });
            TextureUtils.render(topright, result, { x: width - topright.width, y: 0 });
            TextureUtils.render(bottomleft, result, { x: 0, y: height - bottomleft.height });
            TextureUtils.render(bottomright, result, { x: width - bottomright.width, y: height - bottomright.height });

            // Edges
            TextureUtils.render(top, result, { x: topleft.width, y: 0, scaleX: (width - topleft.width - topright.width) / top.width });
            TextureUtils.render(bottom, result, { x: bottomleft.width, y: height - bottom.height, scaleX: (width - bottomleft.width - bottomright.width) / bottom.width });
            TextureUtils.render(left, result, { x: 0, y: topleft.height, scaleY: (height - topleft.height - bottomleft.height) / left.height });
            TextureUtils.render(right, result, { x: width - right.width, y: topright.height, scaleY: (height - topright.height - bottomright.height) / right.height });

            // Center
            TextureUtils.render(center, result, {
                x: topleft.width,
                y: topleft.height,
                scaleX: (width - topleft.width - topright.width) / top.width,
                scaleY: (height - topleft.height - bottomleft.height) / left.height,
            });

            TextureUtils.setImmutable(result);
            cache_ninepatchScaled[key] = result;
        }
        return cache_ninepatchScaled[key];
    }

    export function gcc(key: string, textureFactory: () => PIXI.RenderTexture) {
        return GCCTextures.getOrCacheTexture(key, textureFactory);
    }
}