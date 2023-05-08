namespace SpriteTextConverter {
    type CurrentData = {
        part: number;
    }

    export function textToCharListWithWordWrap(text: string, font: SpriteText.Font, maxWidth: number) {
        if (!text) return [];

        let result: SpriteText.Character[][] = [[]];
        let word: SpriteText.Character[] = [];
        let nextCharPosition: Vector2 = new Vector2(0, 0);
        let tagStack: SpriteText.TagData[] = [];
        let current: CurrentData =  { part: 0 };

        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                pushWord(word, result, nextCharPosition, font, maxWidth, current);
                nextCharPosition.x += font.spaceWidth;
            } else if (text[i] === '\n') {
                pushWord(word, result, nextCharPosition, font, maxWidth, current);
                nextCharPosition.x = 0;
                nextCharPosition.y += getNewLineHeightDiff(nextCharPosition.y, SpriteText.getHeightOfCharList(_.flatten(result)), font.newlineHeight);
                result.push([]);
            } else if (text[i] === '[') {
                let closingBracketIndex = text.indexOf(']', i); 
                if (closingBracketIndex < i+1) {
                    console.error(`Text '${text}' has an unclosed tag bracket.`);
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
            } else if (text[i] === '<') {
                let closingBracketIndex = text.indexOf('>', i); 
                if (closingBracketIndex < i+1) {
                    console.error(`Text '${text}' has an unclosed custom character bracket.`);
                    continue;
                }

                let char = createCharacter(font, text.substring(i+1, closingBracketIndex), nextCharPosition.x, nextCharPosition.y, current.part, tagStack);
                word.push(char);
                nextCharPosition.x += char.width;
                i = closingBracketIndex;
            } else {
                if (text[i] === '\\' && i < text.length-1) i++;
                let char = createCharacter(font, text[i], nextCharPosition.x, nextCharPosition.y, current.part, tagStack);
                word.push(char);
                nextCharPosition.x += char.width;
            }
        }

        pushWord(word, result, nextCharPosition, font, maxWidth, current);

        return result;
    }

    function createCharacter(font: SpriteText.Font, char: string, x: number, y: number, part: number, tagData: SpriteText.TagData[]) {
        let charWidth: number;
        let charHeight: number;

        if (char === ' ') {
            charWidth = font.spaceWidth;
            charHeight = font.charHeight;
        } else {
            let charTexture = AssetCache.getTexture(font.charTextures[char]);
            if (!font.charTextures[char] || !charTexture) {
                console.error(`Font does not have character '${char}':`, font);
                char = 'missing';
                charTexture = AssetCache.getTexture(font.charTextures[char]);
            }
            charWidth = charTexture.width;
            charHeight = charTexture.height;
        }
        
        let character = new SpriteText.Character();
        character.char = char;
        character.x = x;
        character.y = y;
        character.width = charWidth;
        character.height = charHeight;
        character.part = part;
        character.tagData = A.clone(tagData);
        return character;
    }

    function parseTag(tag: string) {
        let result = St.splitOnWhitespace(tag);
        if (_.isEmpty(result)) {
            console.error(`Tag ${tag} must have the tag part specified.`);
            return [SpriteText.NOOP_TAG];
        }
        return result;
    }

    function pushWord(word: SpriteText.Character[], resultLines: SpriteText.Character[][], position: Vector2, font: SpriteText.Font, maxWidth: number, current: CurrentData) {
        if (_.isEmpty(word)) return;

        let lastChar = _.last(word);
        if (maxWidth > 0 && lastChar.right > maxWidth) {
            let diffx = -word[0].x;
            let diffy = getNewLineHeightDiff(word[0].y, SpriteText.getHeightOfCharList(_.flatten(resultLines)), font.newlineHeight);
            for (let char of word) {
                char.x += diffx;
                char.y += diffy;
                char.part++;
            }
            position.x += diffx;
            position.y += diffy;
            current.part++;
            resultLines.push([]);
        }

        while (word.length > 0) {
            _.last(resultLines).push(word.shift());
        }
    }

    function getNewLineHeightDiff(lastLineY: number, heightOfCharList: number, fontNewLineHeight: number) {
        return Math.max(heightOfCharList - lastLineY, fontNewLineHeight);
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
            } else {
                bounds[char.part] = { left: char.left, top: char.top, right: char.right, bottom: char.bottom };
            }
            partToTagData[char.part] = char.tagData;
        }

        let textures: Dict<SpriteText.StaticTextureData> = {};

        for (let part in bounds) {
            let texture = cache_staticTextures.borrow(bounds[part].right - bounds[part].left, bounds[part].bottom - bounds[part].top);
            texture.clear();
            textures[part] = {
                x: bounds[part].left,
                y: bounds[part].top,
                texture: texture,
                tagData: partToTagData[part],
            };
        }

        return textures;
    }

    export function returnStaticTextures(textures: Dict<SpriteText.StaticTextureData>) {
        if (!textures) return;
        for (let part in textures) {
            cache_staticTextures.return(textures[part].texture.width, textures[part].texture.height, textures[part].texture);
        }
    }

    export const cache_staticTextures = new DualKeyPool<number, number, Texture>((w, h) => {
        return new BasicTexture(w, h, 'SpriteTextConverter.getStaticTexturesForCharList', false)
    }, (w, h) => `${w},${h}`);
}