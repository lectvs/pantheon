namespace SpriteTextConverter {
    export function textToCharListWithWordWrap(text: string, font: SpriteText.Font, maxWidth: number) {
        if (!text) return [];

        let result: SpriteText.Character[] = [];
        let word: SpriteText.Character[] = [];
        let nextCharPosition: Vector2 = new Vector2(0, 0);
        let tagStack: SpriteText.TagData[] = [];

        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                pushWord(word, result, nextCharPosition, maxWidth);
                nextCharPosition.x += font.spaceWidth;
            } else if (text[i] === '\n') {
                pushWord(word, result, nextCharPosition, maxWidth);
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

                i = closingBracketIndex;
            } else {
                if (text[i] === '\\' && i < text.length-1) i++;
                let char = createCharacter(text[i], nextCharPosition.x, nextCharPosition.y, font.charWidth, font.charHeight, tagStack);
                word.push(char);
                nextCharPosition.x += char.width;
            }
        }

        pushWord(word, result, nextCharPosition, maxWidth);

        return result;
    }

    function createCharacter(char: string, x: number, y: number, width: number, height: number, tagData: SpriteText.TagData[]) {
        let character = new SpriteText.Character();
        character.char = char;
        character.x = x;
        character.y = y;
        character.width = width;
        character.height = height;
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

    function pushWord(word: SpriteText.Character[], result: SpriteText.Character[], position: Vector2, maxWidth: number) {
        if (_.isEmpty(word)) return;

        let lastChar = _.last(word);
        if (maxWidth > 0 && lastChar.right > maxWidth) {
            let diffx = word[0].x;
            let diffy = word[0].y - SpriteText.getHeightOfCharList(result);
            for (let char of word) {
                char.x -= diffx;
                char.y -= diffy;
            }
            position.x -= diffx;
            position.y -= diffy;
        }

        while (word.length > 0) {
            result.push(word.shift());
        }

        return;
    }

    export function getStaticTexturesForCharList(chars: SpriteText.Character[], visibleChars: number) {
        let bounds: Dict<Boundaries> = {};
        let tagStringToTagData: Dict<SpriteText.TagData[]> = {};
        for (let i = 0; i < visibleChars; i++) {
            let char = chars[i];
            let tagString = char.getTagString();
            if (tagString in bounds) {
                bounds[tagString].left = Math.min(bounds[tagString].left, char.left);
                bounds[tagString].top = Math.min(bounds[tagString].top, char.top);
                bounds[tagString].right = Math.max(bounds[tagString].right, char.right);
                bounds[tagString].bottom = Math.max(bounds[tagString].bottom, char.bottom);
            } else {
                bounds[tagString] = { left: char.left, top: char.top, right: char.right, bottom: char.bottom };
            }
            tagStringToTagData[tagString] = char.tagData;
        }

        let textures: Dict<SpriteText.StaticTextureData> = {};

        for (let tagString in bounds) {
            textures[tagString] = {
                x: bounds[tagString].left,
                y: bounds[tagString].top,
                texture: new BasicTexture(bounds[tagString].right - bounds[tagString].left, bounds[tagString].bottom - bounds[tagString].top),
                tagData: tagStringToTagData[tagString],
            };
        }

        return textures;
    }
}