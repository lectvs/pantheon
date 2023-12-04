/// <reference path="../utils/performanceTracking.ts" />

namespace Textures {
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

    const cache_filledPolygon: Dict<PIXI.RenderTexture> = {};
    export function filledPolygon(points: Pt[], fillColor: number, fillAlpha: number = 1) {
        let key = `[${points.map(p => `${p.x},${p.y}`).join(',')}].${fillColor},${fillAlpha}`;
        if (!cache_filledPolygon[key]) {
            let boundaries = G.getEncompassingBoundaries$(points);
            let result = newPixiRenderTexture(Math.floor(boundaries.width)+1, Math.floor(boundaries.height)+1, 'Textures.filledPolygon');
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
            Draw.polygon(result, points.map(p => vec2(p.x - boundaries.left, p.y - boundaries.top)), { outline: { color: outlineColor, alpha: outlineAlpha, thickness: outlineThickness, alignment }});
            TextureUtils.setImmutable(result);
            cache_outlinePolygon[key] = result;

        }
        return cache_outlinePolygon[key];
    }

    export const NONE = PIXI.Texture.EMPTY;
    export const NOOP = newPixiRenderTexture(0, 0, 'Textures.NOOP');
    export const EFFECT_ONLY = newPixiRenderTexture(0, 0, 'Textures.EFFECT_ONLY');
}