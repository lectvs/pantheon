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

    private container: PIXI.Container;

    constructor(partToCharacters: Dict<SpriteTextParser.Character[]>) {
        this.parts = SpriteTextRenderSystem.buildParts(partToCharacters);
        this.container = new PIXI.Container();
    }

    render(x: number, y: number, spriteText: SpriteText) {
        let textBounds = SpriteText.getBoundsOfCharList(spriteText.getCharList());
        let result: RenderResult[] = [];

        for (let part in this.parts) {
            let data = this.parts[part];
            let style = spriteText.getStyleFromTags(data.tagData, spriteText.style);

            data.sprite.anchor.x = -(data.x + style.offsetX - spriteText.anchor.x * textBounds.width) / data.sprite.width;
            data.sprite.anchor.y = -(data.y + style.offsetY - spriteText.anchor.y * textBounds.height) / data.sprite.height;
            data.sprite.x = x;
            data.sprite.y = y;
            data.sprite.scale.x = (spriteText.flipX ? -1 : 1) * spriteText.scaleX;
            data.sprite.scale.y = (spriteText.flipY ? -1 : 1) * spriteText.scaleY;
            data.sprite.angle = spriteText.angle;
            data.sprite.tint = Color.tint(style.color, spriteText.tint);
            data.sprite.alpha = style.alpha * spriteText.alpha;
            data.sprite.filters = [...style.filters, ...spriteText.effects.getFilterList()];

            let textureLocalBounds = data.sprite.getLocalBounds();

            let screenBounds = new Rectangle(0, 0, screen.width, screen.height);

            if (!G.areRectanglesOverlapping(textureLocalBounds, screenBounds)) continue;

            if (!data.rendered) {
                SpriteTextRenderSystem.renderPart(data);
            }

            result.push(data.sprite);
        }

        diffRender(this.container, result);

        return this.container;
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

            data.sprite.anchor.x = -(data.x + style.offsetX - spriteText.anchor.x * textBounds.width) / data.sprite.width;
            data.sprite.anchor.y = -(data.y + style.offsetY - spriteText.anchor.y * textBounds.height) / data.sprite.height;
            data.sprite.scale.x = (spriteText.flipX ? -1 : 1) * spriteText.scaleX;
            data.sprite.scale.y = (spriteText.flipY ? -1 : 1) * spriteText.scaleY;
            data.sprite.angle = spriteText.angle;

            return data.sprite.getLocalBounds().clone();
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