namespace SpriteTextRenderer {
    export type StaticTextureData = {
        x: number;
        y: number;
        texture: Texture;
        tagData: SpriteText.TagData[];
    }

    export function getRenderedStaticTextures(characters: SpriteTextParser.Character[][], visibleCharCount: number) {
        let partToCharacters = groupCharactersByPart(characters);
        let partToStaticTextureData: DictNumber<StaticTextureData> = {};

        for (let part in partToCharacters) {
            let boundary = G.getEncompassingBoundaries(partToCharacters[part]);
            if (!boundary.isFinite()) {
                console.error('SpriteText character boundaries is not finite:', partToCharacters[part]);
                continue;
            }

            let texture = cache_staticTextures.borrow(Math.ceil(boundary.width), Math.ceil(boundary.height));
            texture.clear();

            for (let character of partToCharacters[part]) {
                character.texture?.renderTo(texture, {
                    x: Math.floor(character.x - boundary.left),
                    y: Math.floor(character.y - boundary.top),
                });
            }

            let tagData = A.clone(partToCharacters[part][0].tagData);

            partToStaticTextureData[part] = {
                x: Math.floor(boundary.left),
                y: Math.floor(boundary.top),
                texture: texture,
                tagData: tagData,
            };
        }

        return partToStaticTextureData;
    }

    function groupCharactersByPart(characters: SpriteTextParser.Character[][]) {
        let partToCharacters: DictNumber<SpriteTextParser.Character[]> = {};
        for (let line of characters) {
            for (let character of line) {
                if (!character.texture) continue;
                if (!(character.part in partToCharacters)) {
                    partToCharacters[character.part] = [];
                }
                partToCharacters[character.part].push(character);
            }
        }
        return partToCharacters;
    }

    export function returnStaticTextures(textures: DictNumber<SpriteText.StaticTextureData> | undefined) {
        if (!textures) return;
        for (let part in textures) {
            cache_staticTextures.return(textures[part].texture.width, textures[part].texture.height, textures[part].texture);
        }
    }

    const cache_staticTextures = new DualKeyPool<number, number, Texture>((w, h) => {
        return new BasicTexture(w, h, 'SpriteText.getStaticTexturesForCharList', false)
    }, (w, h) => `${w},${h}`);
}