namespace SpriteTextRenderSystem {
    export type Part = {
        x: number;
        y: number;
        characters: SpriteTextParser.Character[];
        tagData: SpriteText.TagData[];
        texture: PIXI.RenderTexture;
        sprite: PIXI.Sprite;
        dynamicCharacters: DynamicCharacter[];
        rendered: boolean;
        staticTextureCacheKeyWidth: number;
        staticTextureCacheKeyHeight: number;
        textureCreationSource: string;
    }

    export type DynamicCharacter = {
        character: SpriteTextParser.Character;
        sprite: PIXI.Sprite;
    }
}

class SpriteTextRenderSystem {
    parts: Dict<SpriteTextRenderSystem.Part>;

    constructor(partToCharacters: Dict<SpriteTextParser.Character[]>, textureCreationSource: string) {
        this.parts = SpriteTextRenderSystem.buildParts(partToCharacters, textureCreationSource);
    }

    render(spriteText: SpriteText) {
        let textBounds = SpriteText.getBoundsOfCharList$(spriteText.getCharList());
        let result: Render.Result = FrameCache.array();

        for (let part in this.parts) {
            let data = this.parts[part];
            let style = spriteText.getStyleFromTags$(data.tagData, spriteText.style);

            data.sprite.x = this.getX(spriteText, data, style, textBounds);
            data.sprite.y = this.getY(spriteText, data, style, textBounds);
            data.sprite.scale.x = this.getScaleX(spriteText);
            data.sprite.scale.y = this.getScaleY(spriteText);
            data.sprite.angle = this.getAngle(spriteText);
            data.sprite.tint = Color.combineTints(style.color, spriteText.getTotalTint());
            data.sprite.alpha = style.alpha * spriteText.getTotalAlpha();

            spriteText.effects.pre.pushAll(style.filters);
            data.sprite.updateAndSetEffects(spriteText.effects);

            for (let dynamicChar of data.dynamicCharacters) {
                let v = tmp.vec2(dynamicChar.character.x - data.x, dynamicChar.character.y - data.y);
                v.rotate(data.sprite.angle);
                dynamicChar.sprite.x = data.sprite.x + v.x * data.sprite.scale.x;
                dynamicChar.sprite.y = data.sprite.y + v.y * data.sprite.scale.y;
                dynamicChar.sprite.scale.x = data.sprite.scale.x;
                dynamicChar.sprite.scale.y = data.sprite.scale.y;
                dynamicChar.sprite.angle = data.sprite.angle;
                dynamicChar.sprite.tint = 0xFF0000;
                dynamicChar.sprite.alpha = data.sprite.alpha;

                dynamicChar.sprite.updateAndSetEffects(spriteText.effects);
            }

            spriteText.effects.pre.length -= style.filters.length;  // Remove the style filters

            let textureLocalBounds = TextureUtils.getTextureLocalBounds$(data.texture,
                spriteText.getRenderScreenX() + data.sprite.x,
                spriteText.getRenderScreenY() + data.sprite.y,
                data.sprite.scale.x,
                data.sprite.scale.y,
                data.sprite.angle,
                undefined,
            );

            let allLocalBounds: Rectangle[] = FrameCache.array(textureLocalBounds);
            for (let dynamicChar of data.dynamicCharacters) {
                allLocalBounds.push(TextureUtils.getTextureLocalBounds$(dynamicChar.sprite.texture,
                    spriteText.getRenderScreenX() + dynamicChar.sprite.x,
                    spriteText.getRenderScreenY() + dynamicChar.sprite.y,
                    dynamicChar.sprite.scale.x,
                    dynamicChar.sprite.scale.y,
                    dynamicChar.sprite.angle,
                    undefined,
                ))
            }

            let partLocalBounds = tmp.rectangle(0, 0, 0, 0).copyBoundaries(G.getEncompassingBoundaries$(allLocalBounds));

            let screenBounds = tmp.rectangle_2(0, 0, spriteText.worldd.camera.width, spriteText.worldd.camera.height);
            if (!G.areRectanglesOverlapping(partLocalBounds, screenBounds)) continue;

            if (!data.rendered) {
                SpriteTextRenderSystem.renderPart(data);
            }

            result.push(data.sprite);
            for (let dynamicChar of data.dynamicCharacters) {
                result.push(dynamicChar.sprite);
            }
        }

        return result;
    }

    free() {
        for (let part in this.parts) {
            SpriteTextRenderSystem.freePart(this.parts[part]);
        }
    }

    getSpriteTextLocalBounds$(spriteText: SpriteText) {
        let textBounds = SpriteText.getBoundsOfCharList$(spriteText.getCharList());

        let bounds: Rectangle[] = FrameCache.array();

        for (let part in this.parts) {
            let data = this.parts[part];
            let style = spriteText.getStyleFromTags$(data.tagData, spriteText.style);

            let localBounds = TextureUtils.getTextureLocalBounds$(data.sprite.texture,
                this.getX(spriteText, data, style, textBounds),
                this.getY(spriteText, data, style, textBounds),
                this.getScaleX(spriteText),
                this.getScaleY(spriteText),
                this.getAngle(spriteText),
                data.sprite.anchor,
            );

            bounds.push(localBounds);
        }

        return G.getEncompassingBoundaries$(bounds);
    }

    private getX(spriteText: SpriteText, data: SpriteTextRenderSystem.Part, style: Required<SpriteText.Style>, textBounds: Rectangle) {
        let v = tmp.vec2(this.getUnrotatedX(spriteText, data, style, textBounds), this.getUnrotatedY(spriteText, data, style, textBounds));
        v.rotate(spriteText.angle);
        return v.x;
    }

    private getY(spriteText: SpriteText, data: SpriteTextRenderSystem.Part, style: Required<SpriteText.Style>, textBounds: Rectangle) {
        let v = tmp.vec2(this.getUnrotatedX(spriteText, data, style, textBounds), this.getUnrotatedY(spriteText, data, style, textBounds));
        v.rotate(spriteText.angle);
        return v.y;
    }

    private getUnrotatedX(spriteText: SpriteText, data: SpriteTextRenderSystem.Part, style: Required<SpriteText.Style>, textBounds: Rectangle) {
        return (data.x + style.offsetX - spriteText.anchor.x * textBounds.width) * this.getScaleX(spriteText) + spriteText.offsetX;
    }

    private getUnrotatedY(spriteText: SpriteText, data: SpriteTextRenderSystem.Part, style: Required<SpriteText.Style>, textBounds: Rectangle) {
        return (data.y + style.offsetY - spriteText.anchor.y * textBounds.height) * this.getScaleY(spriteText) + spriteText.offsetY;
    }

    private getScaleX(spriteText: SpriteText) {
        return (spriteText.flipX ? -1 : 1) * spriteText.scaleX;
    }

    private getScaleY(spriteText: SpriteText) {
        return (spriteText.flipY ? -1 : 1) * spriteText.scaleY;
    }

    private getAngle(spriteText: SpriteText) {
        return spriteText.angle;
    }
}

namespace SpriteTextRenderSystem {
    export function buildParts(partToCharacters: Dict<SpriteTextParser.Character[]>, textureCreationSource: string) {
        let result: Dict<SpriteTextRenderSystem.Part> = {};

        for (let part in partToCharacters) {
            let boundary = G.getEncompassingBoundaries$(partToCharacters[part].map(character => character.getTextureBoundaries$()));
            if (!boundary.isFinite()) {
                console.error('SpriteText character boundaries is not finite:', partToCharacters[part]);
                boundary = FrameCache.boundaries(partToCharacters[part][0].x, partToCharacters[part][0].x, partToCharacters[part][0].y, partToCharacters[part][0].y);
            }

            let staticTextureCacheKeyWidth = Math.ceil(boundary.width);
            let staticTextureCacheKeyHeight = Math.ceil(boundary.height);
            let texture = cache_staticTextures.borrow(staticTextureCacheKeyWidth, staticTextureCacheKeyHeight);
            PerformanceTracking.logBorrowSpriteTextStaticTexture(texture, textureCreationSource);

            let dynamicCharacters: DynamicCharacter[] = [];
            for (let character of partToCharacters[part]) {
                if (!character.isDynamic) continue;
                dynamicCharacters.push({
                    character,
                    sprite: new PIXI.Sprite(character.texture),
                });
            }

            result[part] = {
                x: Math.floor(boundary.left),
                y: Math.floor(boundary.top),
                characters: partToCharacters[part],
                tagData: A.clone(partToCharacters[part][0].tagData),
                texture: texture,
                sprite: new PIXI.Sprite(texture),
                dynamicCharacters,
                rendered: false,
                staticTextureCacheKeyWidth,
                staticTextureCacheKeyHeight,
                textureCreationSource,
            };
        }

        return result;
    }

    export function renderPart(part: Part) {
        clearRenderTexture(part.texture);

        let sprite = new PIXI.Sprite();

        for (let character of part.characters) {
            if (!character.texture) continue;
            if (character.isDynamic) continue;
            sprite.texture = character.texture;
            sprite.anchor = sprite.texture.defaultAnchor;
            sprite.x = Math.floor(character.x - part.x);
            sprite.y = Math.floor(character.y - part.y);
            renderToRenderTexture(sprite, part.texture);
        }

        part.rendered = true;
    }

    export function freePart(part: Part) {
        if (!part.sprite) return;
        cache_staticTextures.return(part.staticTextureCacheKeyWidth, part.staticTextureCacheKeyHeight, part.texture);
        PerformanceTracking.logReturnSpriteTextStaticTexture(part.texture, part.textureCreationSource);
    }

    export const cache_staticTextures = new DualKeyPool<number, number, PIXI.RenderTexture>((w, h) => {
        return newPixiRenderTexture(w, h, 'SpriteTextRenderSystem.cache_staticTextures');
    }, (w, h) => `${w},${h}`);
}