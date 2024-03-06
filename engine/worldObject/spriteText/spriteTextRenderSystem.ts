namespace SpriteTextRenderSystem {
    export type Part = {
        x: number;
        y: number;
        characters: SpriteTextParser.Character[];
        tagData: SpriteText.TagData[];
        texture: PIXI.RenderTexture;
        sprite: PIXI.Sprite;
        rendered: boolean;
    }
}

class SpriteTextRenderSystem {
    parts: Dict<SpriteTextRenderSystem.Part>;

    constructor(partToCharacters: Dict<SpriteTextParser.Character[]>) {
        this.parts = SpriteTextRenderSystem.buildParts(partToCharacters);
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
            data.sprite.tint = Color.tint(style.color, spriteText.tint);
            data.sprite.alpha = style.alpha * spriteText.alpha;

            spriteText.effects.pre.pushAll(style.filters);
            data.sprite.updateAndSetEffects(spriteText.effects);
            spriteText.effects.pre.length -= style.filters.length;  // Remove the style filters

            let textureLocalBounds = TextureUtils.getTextureLocalBounds$(data.texture,
                spriteText.getRenderScreenX() + data.sprite.x,
                spriteText.getRenderScreenY() + data.sprite.y,
                data.sprite.scale.x,
                data.sprite.scale.y,
                data.sprite.angle,
            );

            let screenBounds = tmp.rectangle(0, 0, screen.width, screen.height);
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
            );

            bounds.push(localBounds);
        }

        return G.getEncompassingBoundaries$(bounds);
    }

    private getX(spriteText: SpriteText, data: SpriteTextRenderSystem.Part, style: Required<SpriteText.Style>, textBounds: Rectangle) {
        return (data.x + style.offsetX - spriteText.anchor.x * textBounds.width) * this.getScaleX(spriteText) + spriteText.offsetX;
    }

    private getY(spriteText: SpriteText, data: SpriteTextRenderSystem.Part, style: Required<SpriteText.Style>, textBounds: Rectangle) {
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
    export function buildParts(partToCharacters: Dict<SpriteTextParser.Character[]>) {
        let result: Dict<SpriteTextRenderSystem.Part> = {};

        for (let part in partToCharacters) {
            let boundary = G.getEncompassingBoundaries$(partToCharacters[part].map(character => character.getTextureBoundaries$()));
            if (!boundary.isFinite()) {
                console.error('SpriteText character boundaries is not finite:', partToCharacters[part]);
                boundary = FrameCache.boundaries(partToCharacters[part][0].x, partToCharacters[part][0].x, partToCharacters[part][0].y, partToCharacters[part][0].y);
            }

            let texture = cache_staticTextures.borrow(Math.ceil(boundary.width), Math.ceil(boundary.height));

            result[part] = {
                x: Math.floor(boundary.left),
                y: Math.floor(boundary.top),
                characters: partToCharacters[part],
                tagData: A.clone(partToCharacters[part][0].tagData),
                texture: texture,
                sprite: new PIXI.Sprite(texture),
                rendered: false,
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
        cache_staticTextures.return(part.sprite.width, part.sprite.height, part.texture);
    }

    const cache_staticTextures = new DualKeyPool<number, number, PIXI.RenderTexture>((w, h) => {
        return newPixiRenderTexture(w, h, 'SpriteTextRenderSystem.cache_staticTextures');
    }, (w, h) => `${w},${h}`);
}