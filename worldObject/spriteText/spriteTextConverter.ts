namespace SpriteTextConverter {
    type CurrentData = {
        part: number;
    }

    export function textToCharListWithWordWrap(text: string, font: SpriteText.Font, maxWidth: number) {
        if (!text) return [];

        let result: SpriteText.Character[] = [];
        let word: SpriteText.Character[] = [];
        let nextCharPosition: Vector2 = new Vector2(0, 0);
        let tagStack: SpriteText.TagData[] = [];
        let current: CurrentData =  { part: 0 };

        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                pushWord(word, result, nextCharPosition, maxWidth, current);
                nextCharPosition.x += font.spaceWidth;
            } else if (text[i] === '\n') {
                pushWord(word, result, nextCharPosition, maxWidth, current);
                nextCharPosition.x = 0;
                // TODO: properly newline
                nextCharPosition.y += font.newlineHeight; //SpriteText.getHeightOfCharList(result);
            } else if (text[i] === '[') {
                let closingBracketIndex = text.indexOf(']', i); 
                if (closingBracketIndex < i+1) {
                    error(`Text '${text}' has an unclosed tag bracket.`);
                    continue;
                }

                let parts = parseTag(text.substring(i+1, closingBracketIndex));
                if (parts[0].startsWith('/')) {
                    if (!_.isEmpty(tagStack)) {
                        tagStack.pop();
                    }
                } else {
                    let tag = parts.shift();
                    tagStack.push({ tag, params: parts });
                }

                current.part++;
                i = closingBracketIndex;
            } else {
                if (text[i] === '\\' && i < text.length-1) i++;
                let char = createCharacter(text[i], nextCharPosition.x, nextCharPosition.y, font.charWidth, font.charHeight, current.part, tagStack);
                word.push(char);
                nextCharPosition.x += char.width;
            }
        }

        pushWord(word, result, nextCharPosition, maxWidth, current);

        return result;
    }

    function createCharacter(char: string, x: number, y: number, width: number, height: number, part: number, tagData: SpriteText.TagData[]) {
        let character = new SpriteText.Character();
        character.char = char;
        character.x = x;
        character.y = y;
        character.width = width;
        character.height = height;
        character.part = part;
        character.tagData = A.clone(tagData);
        return character;
    }

    function parseTag(tag: string) {
        let result = St.splitOnWhitespace(tag);
        if (_.isEmpty(result)) {
            error(`Tag ${tag} must have the tag part specified.`);
            return [SpriteText.NOOP_TAG];
        }
        return result;
    }

    function pushWord(word: SpriteText.Character[], result: SpriteText.Character[], position: Vector2, maxWidth: number, current: CurrentData) {
        if (_.isEmpty(word)) return;

        let lastChar = _.last(word);
        if (maxWidth > 0 && lastChar.right > maxWidth) {
            let diffx = word[0].x;
            let diffy = word[0].y - SpriteText.getHeightOfCharList(result);
            for (let char of word) {
                char.x -= diffx;
                char.y -= diffy;
                char.part++;
            }
            position.x -= diffx;
            position.y -= diffy;
            current.part++;
        }

        while (word.length > 0) {
            result.push(word.shift());
        }

        return;
    }

    export function getStaticTexturesForCharList(chars: SpriteText.Character[], visibleChars: number) {
        let bounds: Dict<Boundaries> = {};
        let partToTagData: Dict<SpriteText.TagData[]> = {};
        for (let i = 0; i < visibleChars; i++) {
            let char = chars[i];
            if (char.part in bounds) {
                bounds[char.part].left = Math.min(bounds[char.part].left, char.left);
                bounds[char.part].top = Math.min(bounds[char.part].top, char.top);
                bounds[char.part].right = Math.max(bounds[char.part].right, char.right);
                bounds[char.part].bottom = Math.max(bounds[char.part].bottom, char.bottom);
            } else {char.part
                bounds[char.part] = { left: char.left, top: char.top, right: char.right, bottom: char.bottom };
            }
            partToTagData[char.part] = char.tagData;
        }

        let textures: Dict<SpriteText.StaticTextureData> = {};

        for (let part in bounds) {
            textures[part] = {
                x: bounds[part].left,
                y: bounds[part].top,
                texture: new BasicTexture(bounds[part].right - bounds[part].left, bounds[part].bottom - bounds[part].top),
                tagData: partToTagData[part],
            };
        }

        return textures;
    }
}