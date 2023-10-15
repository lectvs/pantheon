namespace SpriteTextRenderSystem {
    export type Part = {
        x: number;
        y: number;
        characters: SpriteTextParser.Character[];
        tagData: SpriteText.TagData[];
        texture: AnchoredTexture;
        rendered: boolean;
    }
}

class SpriteTextRenderSystem {
    parts: Dict<SpriteTextRenderSystem.Part>;

    constructor(partToCharacters: Dict<SpriteTextParser.Character[]>) {
        this.parts = SpriteTextRenderSystem.buildParts(partToCharacters);
    }

    render(screen: Texture, x: number, y: number, spriteText: SpriteText) {
        let textBounds = SpriteText.getBoundsOfCharList(spriteText.getCharList());

        for (let part in this.parts) {
            let data = this.parts[part];
            let style = spriteText.getStyleFromTags(data.tagData, spriteText.style);

            data.texture.anchorX = -(data.x + style.offsetX - spriteText.anchor.x * textBounds.width) / data.texture.width;
            data.texture.anchorY = -(data.y + style.offsetY - spriteText.anchor.y * textBounds.height) / data.texture.height;

            let scaleX = (spriteText.flipX ? -1 : 1) * spriteText.scaleX;
            let scaleY = (spriteText.flipY ? -1 : 1) * spriteText.scaleY;
            let angle = spriteText.angle;

            let textureLocalBounds = data.texture.getLocalBounds({
                x: x,
                y: y,
                scaleX: scaleX,
                scaleY: scaleY,
                angle: angle,
            });

            let screenBounds = new Rectangle(0, 0, screen.width, screen.height);

            if (!G.areRectanglesOverlapping(textureLocalBounds, screenBounds)) continue;

            if (!data.rendered) {
                SpriteTextRenderSystem.renderPart(data);
            }

            data.texture.renderTo(screen, {
                x: x,
                y: y,
                tint: Color.tint(style.color, spriteText.tint),
                alpha: style.alpha * spriteText.alpha,
                scaleX: scaleX,
                scaleY: scaleY,
                angle: angle,
                filters: [...style.filters, ...spriteText.effects.getFilterList()],
                mask: Mask.getTextureMaskForWorldObject(spriteText.mask, spriteText, x, y),
            });
        }
    }

    free() {
        for (let part in this.parts) {
            SpriteTextRenderSystem.freePart(this.parts[part]);
        }
    }

    getSpriteTextLocalBounds(spriteText: SpriteText) {
        let textBounds = SpriteText.getBoundsOfCharList(spriteText.getCharList());

        return G.getEncompassingBoundaries(Object.keys(this.parts).map(part => {
            let data = this.parts[part];
            let style = spriteText.getStyleFromTags(data.tagData, spriteText.style);

            data.texture.anchorX = -(data.x + style.offsetX - spriteText.anchor.x * textBounds.width) / data.texture.width;
            data.texture.anchorY = -(data.y + style.offsetY - spriteText.anchor.y * textBounds.height) / data.texture.height;

            let scaleX = (spriteText.flipX ? -1 : 1) * spriteText.scaleX;
            let scaleY = (spriteText.flipY ? -1 : 1) * spriteText.scaleY;
            let angle = spriteText.angle;

            return data.texture.getLocalBounds({
                scaleX: scaleX,
                scaleY: scaleY,
                angle: angle,
            });
        }));
    }
}

namespace SpriteTextRenderSystem {
    export function buildParts(partToCharacters: Dict<SpriteTextParser.Character[]>) {
        let result: Dict<SpriteTextRenderSystem.Part> = {};

        for (let part in partToCharacters) {
            let boundary = G.getEncompassingBoundaries(partToCharacters[part]);
            if (!boundary.isFinite()) {
                console.error('SpriteText character boundaries is not finite:', partToCharacters[part]);
                boundary = new Boundaries(partToCharacters[part][0].x, partToCharacters[part][0].x, partToCharacters[part][0].y, partToCharacters[part][0].y);
            }

            result[part] = {
                x: Math.floor(boundary.left),
                y: Math.floor(boundary.top),
                characters: partToCharacters[part],
                tagData: A.clone(partToCharacters[part][0].tagData),
                texture: cache_staticTextures.borrow(Math.ceil(boundary.width), Math.ceil(boundary.height)),
                rendered: false,
            };
        }

        return result;
    }

    export function renderPart(part: Part) {
        part.texture.clear();

        for (let character of part.characters) {
            character.texture?.renderTo(part.texture, {
                x: Math.floor(character.x - part.x),
                y: Math.floor(character.y - part.y),
            });
        }

        part.rendered = true;
    }

    export function freePart(part: Part) {
        if (!part.texture) return;
        cache_staticTextures.return(part.texture.width, part.texture.height, part.texture);
    }

    const cache_staticTextures = new DualKeyPool<number, number, AnchoredTexture>((w, h) => {
        return new AnchoredTexture(new BasicTexture(w, h, 'SpriteText.getStaticTexturesForCharList', false), 0, 0)
    }, (w, h) => `${w},${h}`);
}