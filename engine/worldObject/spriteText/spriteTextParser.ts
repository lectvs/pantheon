namespace SpriteTextParser {
    export function parse(props: { lexemes: SpriteTextLexer.Lexeme[], font: SpriteText.Font, maxWidth: number, fixedCharSize: boolean }) {
        let { lexemes, font, maxWidth, fixedCharSize } = props;

        let result: Character[][] = [];
        let currentLine: Character[] = [];
        let currentExtraNewlineCount = 0;
        let currentRight = () => A.isEmpty(currentLine) ? 0 : M.max(currentLine, char => char.right);

        for (let lexeme of lexemes) {
            if (lexeme.type === 'space') {
                let space = Character.SPACE(font.spaceWidth * lexeme.count, font.charHeight);
                space.x = currentRight() - space.left;
                currentLine.push(space);
                continue;
            }

            if (lexeme.type === 'newline') {
                pushLine(result, currentLine);
                currentLine = [];
                currentExtraNewlineCount = lexeme.count-1;
                continue;
            }

            if (lexeme.type === 'word') {
                let word = createWord(lexeme.chars, font, fixedCharSize);
                if (currentRight() + (word.right - word.left) > maxWidth) {
                    pushLine(result, currentLine);
                    currentLine = []
                    currentExtraNewlineCount = 0;
                }
                word.x = currentRight() - word.left;
                word.y = currentExtraNewlineCount * font.newlineHeight;

                for (let character of word.characters) {
                    character.x += word.x;
                    character.y += word.y;
                    currentLine.push(character);
                }
                
                continue;
            }

            assertUnreachable(lexeme);
        }

        pushLine(result, currentLine);

        return result;
    }

    function pushLine(result: Character[][], line: Character[]) {
        if (A.isEmpty(line)) return;
        let resultBottom = A.isEmpty(result) ? 0 : M.max(result.last()!, char => char.bottom);
        let lineTop = M.min(line, char => char.top);

        let dy = resultBottom - lineTop;
        for (let char of line) {
            char.y += dy;
        }

        result.push(line);
    }

    function createWord(chars: SpriteTextLexer.Char[], font: SpriteText.Font, fixedCharSize: boolean) {
        let characters: Character[] = [];

        for (let char of chars) {
            let character = createCharacter(char, font, fixedCharSize);
            let lastCharacterRight = A.isEmpty(characters) ? 0 : characters.last()!.right;
            character.x = lastCharacterRight - (character.left - character.x);

            characters.push(character);
        }

        return new Word(characters);
    }

    function createCharacter(char: SpriteTextLexer.Char, font: SpriteText.Font, fixedCharSize: boolean) {
        let textureKey = char.isCustom ? char.name : font.charTextures[char.name];
        let texture = AssetCache.getPixiTexture(textureKey);
        if (!texture) {
            textureKey = font.charTextures['missing'];
            texture = AssetCache.getPixiTexture(textureKey);
        }

        let localBounds = fixedCharSize
            ? new Rectangle(0, 0, font.charWidth, font.charHeight)
            : TextureUtils.getTextureLocalBounds$(texture, {}).clone();

        return new Character({
            name: char.name,
            texture: texture,
            localBounds: localBounds,
            tagData: A.clone(char.tagData),
            part: char.part,
        });
    }

    export class Character {
        x: number;
        y: number;
        name: string;
        texture: PIXI.Texture | undefined;
        localBounds: Rectangle;
        tagData: SpriteText.TagData[];
        part: number;

        constructor(props: { name: string, texture: PIXI.Texture | undefined, localBounds: Rectangle, tagData: SpriteText.TagData[], part: number }) {
            this.x = 0;
            this.y = 0;
            this.name = props.name;
            this.texture = props.texture;
            this.localBounds = props.localBounds;
            this.tagData = props.tagData;
            this.part = props.part;
        }

        get left() {
            return this.x + this.localBounds.left;
        }

        get right() {
            return this.x + this.localBounds.right;
        }

        get top() {
            return this.y + this.localBounds.top;
        }

        get bottom() {
            return this.y + this.localBounds.bottom;
        }

        static SPACE(width: number, height: number) {
            return new Character({
                name: ' ',
                texture: undefined,
                localBounds: new Rectangle(0, 0, width, height),
                tagData: [],
                part: -1,
            });
        }
    }

    export class Word {
        x: number;
        y: number;
        characters: Character[];

        constructor(characters: Character[]) {
            this.x = 0;
            this.y = 0;
            this.characters = characters;
        }

        get left() {
            return this.x + M.min(this.characters, char => char.left);
        }

        get right() {
            return this.x + M.max(this.characters, char => char.right);
        }

        get top() {
            return this.y + M.min(this.characters, char => char.top);
        }

        get bottom() {
            return this.y + M.max(this.characters, char => char.bottom);
        }
    }
}