namespace SpriteTextParser {
    type Props = {
        lexemes: SpriteTextLexer.Lexeme[],
        font: SpriteText.Font,
        maxWidth: number,
        spaceBetweenLines: number | undefined,
        blankLineHeight: number | undefined,
        fixedCharSize: boolean,
        charProperties: SpriteText.CharProperties,
    }

    export function parse(props: Props) {
        let {
            lexemes,
            font,
            maxWidth,
            spaceBetweenLines,
            blankLineHeight,
        } = props;

        spaceBetweenLines = spaceBetweenLines ?? font.spaceBetweenLines;
        blankLineHeight = blankLineHeight ?? font.blankLineHeight;

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
                pushLine(result, currentLine, spaceBetweenLines);
                currentLine = [];
                currentExtraNewlineCount = lexeme.count-1;
                continue;
            }

            if (lexeme.type === 'word') {
                let word = createWord(lexeme.chars, props);
                if (currentRight() + (word.right - word.left) > maxWidth) {
                    pushLine(result, currentLine, spaceBetweenLines);
                    currentLine = []
                    currentExtraNewlineCount = 0;
                }
                word.x = currentRight() - word.left;
                word.y = currentExtraNewlineCount * blankLineHeight;

                for (let character of word.characters) {
                    character.x += word.x;
                    character.y += word.y;
                    currentLine.push(character);
                }
                
                continue;
            }

            assertUnreachable(lexeme);
        }

        pushLine(result, currentLine, spaceBetweenLines);

        return result;
    }

    function pushLine(result: Character[][], line: Character[], spaceBetweenLines: number) {
        if (A.isEmpty(line)) return;
        let resultBottom = A.isEmpty(result) ? 0 : M.max(result.last()!, char => char.bottom);
        let lineTop = M.min(line, char => char.top);

        let dy = resultBottom - lineTop;
        if (!A.isEmpty(result)) dy += spaceBetweenLines;
        for (let char of line) {
            char.y += dy;
        }

        result.push(line);
    }

    function createWord(chars: SpriteTextLexer.Char[], props: Props) {
        let characters: Character[] = [];

        for (let char of chars) {
            let character = createCharacter(char, props);
            let lastCharacterRight = A.isEmpty(characters) ? 0 : characters.last()!.right;
            character.x += lastCharacterRight - character.left;

            characters.push(character);
        }

        return new Word(characters);
    }

    function createCharacter(char: SpriteTextLexer.Char, props: Props) {
        let textureKey = char.isCustom ? char.name : props.font.charTextures[char.name];
        let texture = AssetCache.getTexture(textureKey);
        if (!texture) {
            textureKey = props.font.charTextures['missing'];
            texture = AssetCache.getTexture(textureKey);
        }

        let anchor = SpriteText.getCharProperty(props.charProperties, 'anchor', char.name, char.position)
            ?? texture.defaultAnchor;

        // Align the character with the font char's bounds according to its anchor.
        let x = Math.ceil(props.font.charWidth * anchor.x + texture.width * (texture.defaultAnchor.x - anchor.x));
        let y = Math.ceil(props.font.charHeight * anchor.y + texture.height * (texture.defaultAnchor.y - anchor.y));

        let localBounds = props.fixedCharSize
            ? new Rectangle(-x, -y, props.font.charWidth, props.font.charHeight)
            : TextureUtils.getTextureLocalBounds$(texture, 0, 0, 1, 1, 0, undefined).clone();

        let tagData = A.clone(char.tagData);
        let part = char.part;

        let colorOverride = SpriteText.getCharProperty(props.charProperties, 'color', char.name, char.position);
        if (colorOverride !== undefined && colorOverride >= 0) {
            tagData.push({ tag: 'color', params: [`${colorOverride}`] });
        }

        let offsetXOverride = SpriteText.getCharProperty(props.charProperties, 'offsetX', char.name, char.position);
        let offsetYOverride = SpriteText.getCharProperty(props.charProperties, 'offsetY', char.name, char.position);
        if (offsetXOverride !== undefined || offsetYOverride !== undefined) {
            let offsetx = offsetXOverride ?? 0;
            let offsety = offsetYOverride ?? 0;
            tagData.push({ tag: 'offset', params: [`${offsetx}`, `${offsety}`] });
        }

        Random.seed(char.name);
        return new Character({
            x, y,
            name: char.name,
            position: char.position,
            texture: texture,
            localBounds: localBounds,
            tagData: tagData,
            part: part,
            isDynamic: Random.boolean(),
        });
    }

    export class Character {
        x: number;
        y: number;
        name: string;
        position: number | undefined;
        texture: PIXI.Texture | undefined;
        localBounds: Rectangle;
        tagData: SpriteText.TagData[];
        part: number;
        isDynamic: boolean;

        constructor(props: {
            x: number,
            y: number,
            name: string,
            position: number | undefined,
            texture: PIXI.Texture | undefined,
            localBounds: Rectangle, 
            tagData: SpriteText.TagData[],
            part: number,
            isDynamic: boolean,
        }) {
            this.x = props.x;
            this.y = props.y;
            this.name = props.name;
            this.position = props.position;
            this.texture = props.texture;
            this.localBounds = props.localBounds;
            this.tagData = props.tagData;
            this.part = props.part;
            this.isDynamic = props.isDynamic;
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

        getTextureBoundaries$() {
            if (!this.texture) {
                return FrameCache.rectangle(this.x, this.y, 0, 0);
            }
            return TextureUtils.getTextureLocalBounds$(this.texture, this.x, this.y, 1, 1, 0, undefined);
        }

        static SPACE(width: number, height: number) {
            return new Character({
                x: 0, y: 0,
                name: ' ',
                position: undefined,
                texture: undefined,
                localBounds: new Rectangle(0, 0, width, height),
                tagData: [],
                part: -1,
                isDynamic: false,
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