namespace SpriteTextRenderSystem {
    export type Part = {
        x: number;
        y: number;
        characters: SpriteTextParser.Character[];
        tagData: SpriteText.TagData[];
        texture: Texture;
        rendered: boolean;
    }
}

class SpriteTextRenderSystem {
    parts: Dict<SpriteTextRenderSystem.Part>;

    constructor(partToCharacters: Dict<SpriteTextParser.Character[]>) {
        this.parts = SpriteTextRenderSystem.buildParts(partToCharacters);
    }

    render(screen: Texture, x: number, y: number, spriteText: SpriteText) {
        let anchorOffsetX = Math.round(-spriteText.anchor.x * spriteText.getTextWidth());
        let anchorOffsetY = Math.round(-spriteText.anchor.y * spriteText.getTextHeight());

        for (let part in this.parts) {
            let data = this.parts[part];
            let style = SpriteTextRenderSystem.getStyleFromTags(data.tagData, spriteText.style);

            let renderX = x + anchorOffsetX + (data.x + style.offsetX) * (spriteText.flipX ? -1 : 1) * spriteText.scaleX;
            let renderY = y + anchorOffsetY + (data.y + style.offsetY) * (spriteText.flipY ? -1 : 1) * spriteText.scaleY;
            let scaleX = (spriteText.flipX ? -1 : 1) * spriteText.scaleX;
            let scaleY = (spriteText.flipY ? -1 : 1) * spriteText.scaleY;

            let textureLocalBounds = data.texture.getLocalBounds({
                x: renderX,
                y: renderY,
                scaleX: scaleX,
                scaleY: scaleY,
            });

            let screenBounds = new Rectangle(0, 0, screen.width, screen.height);

            if (!G.areRectanglesOverlapping(textureLocalBounds, screenBounds)) continue;

            if (!data.rendered) {
                SpriteTextRenderSystem.renderPart(data);
            }

            data.texture.renderTo(screen, {
                x: renderX,
                y: renderY,
                tint: Color.tint(style.color, spriteText.tint),
                alpha: style.alpha * spriteText.alpha,
                scaleX: scaleX,
                scaleY: scaleY,
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

    const cache_staticTextures = new DualKeyPool<number, number, Texture>((w, h) => {
        return new BasicTexture(w, h, 'SpriteText.getStaticTexturesForCharList', false)
    }, (w, h) => `${w},${h}`);

    export function getStyleFromTags(tagData: SpriteText.TagData[], defaults: Required<SpriteText.Style>) {
        let result: SpriteText.Style = { filters: [] };
        for (let data of tagData) {
            let style = getTagStyle(data.tag, data.params);
            if (style.color !== undefined) result.color = style.color;
            if (style.alpha !== undefined) result.alpha = style.alpha;
            if (style.offsetX !== undefined) result.offsetX = style.offsetX;
            if (style.offsetY !== undefined) result.offsetY = style.offsetY;
            if (!A.isEmpty(style.filters)) result.filters!.push(...style.filters);
        }

        return O.defaults(result, defaults);
    }

    function getTagStyle(name: string, params: string[]) {
        let cacheKey = [name, ...params].join(' ');
        if (cacheKey in tagCache) {
            return tagCache[cacheKey];
        }
        let tag = SpriteText.TAGS[name];
        if (!tag) {
            console.error(`Tag not found: ${name}`);
            tag = SpriteText.TAGS[SpriteText.NOOP_TAG];
        }

        let style = tag(params);
        tagCache[cacheKey] = style;
        return style;
    }

    const tagCache: Dict<SpriteText.Style> = {};
}