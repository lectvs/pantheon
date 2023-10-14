namespace SpriteTextRenderer {
    export function getRenderSystem(characters: SpriteTextParser.Character[]) {
        let partToCharacters = groupCharactersByPart(characters);

        return new SpriteTextRenderSystem(partToCharacters);
    }

    function groupCharactersByPart(characters: SpriteTextParser.Character[]) {
        let partToCharacters: DictNumber<SpriteTextParser.Character[]> = {};
        for (let character of characters) {
            if (!character.texture) continue;
            if (!(character.part in partToCharacters)) {
                partToCharacters[character.part] = [];
            }
            partToCharacters[character.part].push(character);
        }
        return partToCharacters;
    }
}