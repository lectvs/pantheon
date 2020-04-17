class SpriteTextConverter {
    static textToCharListWithWordWrap(text: string, font: SpriteText.Font, maxWidth: number) {
        if (!text) return [];

        let result: SpriteText.Character[] = [];
        let word: SpriteText.Character[] = [];
        let nextCharPosition: Pt = { x: 0, y: 0 };
        let styleStack: SpriteText.Style[] = [];

        for (let i = 0; i < text.length; i++) {
            if (text[i] === ' ') {
                this.pushWord(word, result, nextCharPosition, maxWidth);
                nextCharPosition.x += font.spaceWidth;
            } else if (text[i] === '\n') {
                this.pushWord(word, result, nextCharPosition, maxWidth);
                nextCharPosition.x = 0;
                nextCharPosition.y = SpriteText.getHeightOfCharList(result);
            } else if (text[i] === '[') {
                let closingBracketIndex = text.indexOf(']', i); 
                if (closingBracketIndex < i+1) {
                    debug(`Text '${text}' has an unclosed tag bracket.`);
                    continue;
                }

                let parts = this.parseTag(text.substring(i+1, closingBracketIndex));
                if (parts[0].startsWith('/')) {
                    if (!_.isEmpty(styleStack)) {
                        styleStack.pop();
                    }
                } else {
                    let tag = parts.shift();
                    let newStyle = this.getStyleFromTag(tag, parts);
                    styleStack.push(newStyle);
                }

                i = closingBracketIndex;
            } else {
                if (text[i] === '\\' && i < text.length-1) i++;
                let style = this.getFullStyleFromStack(styleStack);
                let char = this.createCharacter(text[i], nextCharPosition.x, nextCharPosition.y, font, style);
                word.push(char);
                nextCharPosition.x += char.width;
            }
        }

        this.pushWord(word, result, nextCharPosition, maxWidth);

        return result;
    }

    private static createCharacter(char: string, x: number, y: number, font: SpriteText.Font, style: SpriteText.Style) {
        let character = new SpriteText.Character();
        character.char = char;
        character.x = x;
        character.y = y;
        character.font = font;
        character.style = style;
        return character;
    }

    private static getFullStyleFromStack(styleStack: SpriteText.Style[]) {
        return _.extend({}, ...styleStack);
    }

    private static getStyleFromTag(tag: string, params: string[]) {
        let tagFunction = SpriteText.DEFAULT_TAGS[tag] || SpriteText.DEFAULT_TAGS[SpriteText.NOOP_TAG];
        return tagFunction(params);
    }

    private static parseTag(tag: string) {
        let result = S.splitOnWhitespace(tag);
        if (_.isEmpty(result)) {
            debug(`Tag ${tag} must have the tag part specified.`);
            return [SpriteText.NOOP_TAG];
        }
        return result;
    }

    private static pushWord(word: SpriteText.Character[], result: SpriteText.Character[], position: Pt, maxWidth: number) {
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
}