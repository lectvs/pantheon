namespace Textures {
    const cache_filledCircle: Dict<PIXI.RenderTexture> = {};
    export function filledCircle(radius: number, fillColor: number, fillAlpha: number = 1) {
        let key = `${radius},${fillColor},${fillAlpha}`;
        if (!cache_filledCircle[key]) {
            let result = newPixiRenderTexture(radius*2, radius*2, 'Texture.filledCircle');
            result.defaultAnchor.set(0.5, 0.5);
            Draw.circle(result, radius, radius, radius, { fill: { color: fillColor, alpha: fillAlpha }});
            cache_filledCircle[key] = result;
        }
        
        return cache_filledCircle[key];
    }

    const cache_filledRect: Dict<PIXI.RenderTexture> = {};
    export function filledRect(width: number, height: number, fillColor: number, fillAlpha: number = 1) {
        let key = `${width},${height},${fillColor},${fillAlpha}`;
        if (!cache_filledRect[key]) {
            let result = newPixiRenderTexture(width, height, 'Texture.filledRect');
            Draw.rectangle(result, 0, 0, width, height, { fill: { color: fillColor, alpha: fillAlpha }});
            cache_filledRect[key] = result;
        }
        
        return cache_filledRect[key];
    }

    // TODO: this doesn't work after migrating to PIXI
    export function ninepatch(sourceTexture: PIXI.Texture, innerRect: Rect, targetWidth: number, targetHeight: number, tiled: boolean = false) {
        let result = newPixiRenderTexture(targetWidth, targetHeight, 'Texture.ninepatch');

        let remwidth = sourceTexture.width - (innerRect.x + innerRect.width);
        let remheight = sourceTexture.height - (innerRect.y + innerRect.height);

        let innerScaleX = (targetWidth - innerRect.x - remwidth) / (innerRect.width);
        let innerScaleY = (targetHeight - innerRect.y - remheight) / (innerRect.height);

        let sprite = new PIXI.Sprite(sourceTexture.clone());
        sprite.texture.defaultAnchor.set(0, 0);
        sprite.anchor.set(0, 0);

        if (tiled) {
            let countX = Math.max(1, Math.floor(innerScaleX));
            let countY = Math.max(1, Math.floor(innerScaleY));
            let pieceScaleX = innerScaleX / countX;
            let pieceScaleY = innerScaleY / countY;

            // Center
            for (let i = 0; i < countX; i++) {
                for (let j = 0; j < countY; j++) {
                    sprite.x = innerRect.x + i*innerRect.width*pieceScaleX;
                    sprite.y = innerRect.y + j*innerRect.height*pieceScaleY;
                    sprite.scale.set(pieceScaleX, pieceScaleY);
                    sprite.texture.frame = new PIXI.Rectangle(innerRect.x, innerRect.y, innerRect.width, innerRect.height);
                    renderToRenderTexture(sprite, result);
                }
            }

            // Edges
            for (let i = 0; i < countX; i++) {
                sprite.x = innerRect.x + i*innerRect.width*pieceScaleX;
                sprite.y = 0;
                sprite.scale.set(pieceScaleX, 1);
                sprite.texture.frame = new PIXI.Rectangle(innerRect.x, 0, innerRect.width, innerRect.y);
                renderToRenderTexture(sprite, result);

                sprite.x = innerRect.x + i*innerRect.width*pieceScaleX;
                sprite.y = targetHeight - remheight;
                sprite.scale.set(pieceScaleX, 1);
                sprite.texture.frame = new PIXI.Rectangle(innerRect.x, innerRect.y + innerRect.width, innerRect.width, remheight);
                renderToRenderTexture(sprite, result);
            }
            for (let j = 0; j < countY; j++) {
                sprite.x = 0;
                sprite.y = innerRect.y + j*innerRect.height*pieceScaleY;
                sprite.scale.set(1, pieceScaleY);
                sprite.texture.frame = new PIXI.Rectangle(0, innerRect.y, innerRect.x, innerRect.height);
                renderToRenderTexture(sprite, result);

                sprite.x = targetWidth - remwidth;
                sprite.y = innerRect.y + j*innerRect.height*pieceScaleY;
                sprite.scale.set(1, pieceScaleY);
                sprite.texture.frame = new PIXI.Rectangle(innerRect.x + innerRect.width, innerRect.y, remwidth, innerRect.height);
                renderToRenderTexture(sprite, result);
            }

        } else {
            // Center
            sprite.x = innerRect.x;
            sprite.y = innerRect.y;
            sprite.scale.set(innerScaleX, innerScaleY);
            sprite.texture.frame = new PIXI.Rectangle(innerRect.x, innerRect.y, innerRect.width, innerRect.height);
            renderToRenderTexture(sprite, result);

            // Edges
            sprite.x = innerRect.x;
            sprite.y = 0;
            sprite.scale.set(innerScaleX, 1);
            sprite.texture.frame = new PIXI.Rectangle(innerRect.x, 0, innerRect.width, innerRect.y);
            renderToRenderTexture(sprite, result);

            sprite.x = innerRect.x;
            sprite.y = targetHeight - remheight;
            sprite.scale.set(innerScaleX, 1);
            sprite.texture.frame = new PIXI.Rectangle(innerRect.x, innerRect.y + innerRect.height, innerRect.width, remheight);
            renderToRenderTexture(sprite, result);

            sprite.x = 0;
            sprite.y = innerRect.y;
            sprite.scale.set(1, innerScaleY);
            sprite.texture.frame = new PIXI.Rectangle(0, innerRect.y, innerRect.x, innerRect.height);
            renderToRenderTexture(sprite, result);

            sprite.x = targetWidth - remwidth;
            sprite.y = innerRect.y;
            sprite.scale.set(1, innerScaleY);
            sprite.texture.frame = new PIXI.Rectangle(innerRect.x + innerRect.width, innerRect.y, remwidth, innerRect.height);
            renderToRenderTexture(sprite, result);
        }

        // Corners
        sprite.x = 0;
        sprite.y = 0;
        sprite.scale.set(1, 1);
        sprite.texture.frame = new PIXI.Rectangle(0, 0, innerRect.x, innerRect.y);
        renderToRenderTexture(sprite, result);

        sprite.x = targetWidth - remwidth;
        sprite.y = 0;
        sprite.scale.set(1, 1);
        sprite.texture.frame = new PIXI.Rectangle(innerRect.x + innerRect.width, 0, remwidth, innerRect.y);
        renderToRenderTexture(sprite, result);

        sprite.x = 0;
        sprite.y = targetHeight - remheight;
        sprite.scale.set(1, 1);
        sprite.texture.frame = new PIXI.Rectangle(0, innerRect.y + innerRect.height, innerRect.x, remheight);
        renderToRenderTexture(sprite, result);

        sprite.x = targetWidth - remwidth;
        sprite.y = targetHeight - remheight;
        sprite.scale.set(1, 1);
        sprite.texture.frame = new PIXI.Rectangle(innerRect.x + innerRect.width, innerRect.y + innerRect.height, remwidth, remheight);
        renderToRenderTexture(sprite, result);

        sprite.texture.destroy();

        return result;
    }

    const cache_outlineRect: Dict<PIXI.RenderTexture> = {};
    export function outlineRect(width: number, height: number, outlineColor: number, outlineAlpha: number = 1, outlineThickness: number = 1) {
        let key = `${width},${height},${outlineColor},${outlineAlpha},${outlineThickness}`;
        if (!cache_outlineRect[key]) {
            let result = newPixiRenderTexture(width, height, 'Texture.outlineRect');
            Draw.rectangle(result, 0, 0, width, height, { outline: { color: outlineColor, alpha: outlineAlpha, thickness: outlineThickness }});
            cache_outlineRect[key] = result;
        }
        return cache_outlineRect[key];
    }

    const cache_outlineCircle: Dict<PIXI.RenderTexture> = {};
    export function outlineCircle(radius: number, outlineColor: number, outlineAlpha: number = 1, outlineThickness: number = 1) {
        let key = `${radius},${outlineColor},${outlineAlpha},${outlineThickness}`;
        if (!cache_outlineCircle[key]) {
            let result = newPixiRenderTexture(radius*2, radius*2, 'Texture.outlineCircle');
            result.defaultAnchor.set(0.5, 0.5);
            Draw.circle(result, radius, radius, radius, { outline: { color: outlineColor, alpha: outlineAlpha, thickness: outlineThickness }});
            cache_outlineCircle[key] = result;
        }
        
        return cache_outlineCircle[key];
    }

    export const NONE = PIXI.Texture.EMPTY;
    export const NOOP = newPixiRenderTexture(0, 0, 'Textures.NOOP');
    export const EFFECT_ONLY = newPixiRenderTexture(0, 0, 'Textures.EFFECT_ONLY');
}