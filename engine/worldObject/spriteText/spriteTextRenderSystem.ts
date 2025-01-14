namespace SpriteTextRenderSystem {
    export type Part = {
        x: number;
        y: number;
        characters: SpriteTextParser.Character[];
        tagData: SpriteText.TagData[];
        texture: PIXI.RenderTexture;
        sprite: PIXI.Sprite;
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
    private spriteText: SpriteText;
    parts: Dict<SpriteTextRenderSystem.Part>;

    constructor(spriteText: SpriteText, characters: SpriteTextParser.Character[][], textureCreationSource: string) {
        this.spriteText = spriteText;

        let partToCharacters = SpriteTextRenderSystem.sortCharactersByPart(characters, spriteText);
        this.parts = SpriteTextRenderSystem.buildParts(partToCharacters, textureCreationSource);
    }

    render() {
        let textBounds = SpriteText.getBoundsOfCharList$(this.spriteText.getCharList());
        let result: Render.Result = FrameCache.array();

        for (let part in this.parts) {
            let data = this.parts[part];
            let style = this.spriteText.getStyleFromTags$(data.tagData, this.spriteText.style);
            let styleColor = this.resolveStyleAttribute(style, 'color', this.spriteText, data.characters[0]);
            let styleAlpha = this.resolveStyleAttribute(style, 'alpha', this.spriteText, data.characters[0]);

            data.sprite.x = this.getX(this.spriteText, data, style, textBounds);
            data.sprite.y = this.getY(this.spriteText, data, style, textBounds);
            data.sprite.scale.x = this.getScaleX(this.spriteText);
            data.sprite.scale.y = this.getScaleY(this.spriteText);
            data.sprite.angle = this.getAngle(this.spriteText);
            data.sprite.tint = Color.combineTints(styleColor, this.spriteText.getTotalTint());
            data.sprite.alpha = styleAlpha * this.spriteText.getTotalAlpha();

            this.spriteText.effects.pre.pushAll(style.filters);
            data.sprite.updateAndSetEffects(this.spriteText.effects);
            this.spriteText.effects.pre.length -= style.filters.length;  // Remove the style filters

            let textureLocalBounds = TextureUtils.getTextureLocalBounds$(data.texture,
                this.spriteText.getRenderScreenX() + data.sprite.x,
                this.spriteText.getRenderScreenY() + data.sprite.y,
                data.sprite.scale.x,
                data.sprite.scale.y,
                data.sprite.angle,
                undefined,
            );

            let screenBounds = tmp.rectangle_2(0, 0, this.spriteText.worldd.camera.width, this.spriteText.worldd.camera.height);
            if (!G.areRectanglesOverlapping(textureLocalBounds, screenBounds)) continue;

            if (!data.rendered) {
                SpriteTextRenderSystem.renderPart(data);
            }

            result.push(data.sprite);
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
        let styleOffsetX = this.resolveStyleAttribute(style, 'offsetX', spriteText, data.characters[0]);
        return (data.x + styleOffsetX - spriteText.anchor.x * textBounds.width) * this.getScaleX(spriteText) + spriteText.offsetX;
    }

    private getUnrotatedY(spriteText: SpriteText, data: SpriteTextRenderSystem.Part, style: Required<SpriteText.Style>, textBounds: Rectangle) {
        let styleOffsetY = this.resolveStyleAttribute(style, 'offsetY', spriteText, data.characters[0]);
        return (data.y + styleOffsetY - spriteText.anchor.y * textBounds.height) * this.getScaleY(spriteText) + spriteText.offsetY;
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

    private resolveStyleAttribute<K extends keyof SpriteText.Style>(style: Required<SpriteText.Style>, attr: K, spriteText: SpriteText, character: SpriteTextParser.Character): Exclude<Required<SpriteText.Style>[K], Function> {
        let value = style[attr];
        if (O.isFunction(value)) {
            let data: SpriteText.StyleDynamicData = FrameCache.object();
            data.charName = character.name;
            data.position = character.position;
            data.t = spriteText.life.time;
            return value(data) as Exclude<Required<SpriteText.Style>[K], Function>;
        }
        return value as Exclude<Required<SpriteText.Style>[K], Function>;
    }
}

namespace SpriteTextRenderSystem {
    export function sortCharactersByPart(characters: SpriteTextParser.Character[][], spriteText: SpriteText) {
        let currentPart = 0;
        let currentTagData: SpriteText.TagData[] = [];
        let partsToCharacters: Dict<SpriteTextParser.Character[]> = {};

        for (let line of characters) {
            for (let char of line) {
                if (!char.texture) continue;
                if (!SpriteText.tagsEqual(char.tagData, currentTagData)
                        || SpriteText.isTagDataDynamic(char.tagData, spriteText)) {
                    currentPart++;
                }

                if (!(currentPart in partsToCharacters)) {
                    partsToCharacters[currentPart] = [];
                }

                partsToCharacters[currentPart].push(char);
                currentTagData = char.tagData;
            }
            currentPart++;
        }

        return partsToCharacters;
    }

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

            result[part] = {
                x: Math.floor(boundary.left),
                y: Math.floor(boundary.top),
                characters: partToCharacters[part],
                tagData: A.clone(partToCharacters[part][0].tagData),
                texture: texture,
                sprite: new PIXI.Sprite(texture),
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