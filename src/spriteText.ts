namespace SpriteText {
    export type Config = WorldObject.Config & {
        font: Font;
        text?: string;
        style?: Style;
    }

    export type Font = {
        texture: string;
        charWidth: number;
        charHeight: number;
        spaceWidth: number;
    }

    export type Style = {
        color?: number;
        offset?: number;
    }

    export type TagFunction = (params: string[]) => SpriteText.Style;
}

class SpriteText extends WorldObject {
    font: SpriteText.Font;
    style: SpriteText.Style;
    chars: SpriteText.Character[];

    private fontSprite: PIXI.Sprite;

    constructor(config: SpriteText.Config) {
        super(config);
        this.font = config.font;
        this.style = _.defaults(config.style, {
            color: 0xFFFFFF,
            offset: 0,
        });
        this.setText(config.text);

        this.fontSprite = new PIXI.Sprite(AssetCache.getTexture(this.font.texture).clone());
    }

    update() {
        super.update();
    }

    render() {
        for (let char of this.chars) {
            this.setFontSpriteToCharacter(char);
            this.setStyle(char.style);
            global.screen.renderDisplayObject(this.fontSprite);
        }
        super.render();
    }

    clear() {
        this.setText("");
    }

    get mask() {
        return this.fontSprite.mask;
    }

    getTextHeight() {
        return SpriteText.getHeightOfCharList(this.chars);
    }

    setFontSpriteToCharacter(char: SpriteText.Character) {
        this.fontSprite.x = this.x + char.x;
        this.fontSprite.y = this.y + char.y;

        let frame = SpriteText.charCodes[char.char];
        this.fontSprite.texture.frame.x = frame.x * this.font.charWidth;
        this.fontSprite.texture.frame.y = frame.y * this.font.charHeight;
        this.fontSprite.texture.frame = this.fontSprite.texture.frame;  // Must actually set the frame for changes to take effect.
    }

    set mask(value) {
        this.fontSprite.mask = value;
    }

    setStyle(style: SpriteText.Style) {
        this.fontSprite.tint = O.getOrDefault(style.color, this.style.color);
        this.fontSprite.y += O.getOrDefault(style.offset, this.style.offset);
    }

    setText(text: string) {
        this.chars = SpriteTextConverter.textToCharListWithWordWrap(text, this.font, 0);
    }
}

namespace SpriteText {
    export const charCodes: Dict<Pt> = getCharCodes();
    function getCharCodes() {
        let spriteFontCharList = [
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
            ['U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd'],
            ['e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
            ['o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'],
            ['y', 'z', '0', '1', '2', '3', '4', '5', '6', '7'],
            ['8', '9', '!', '@', '#', '$', '%', '^', '&', '*'],
            ['(', ')', '-', '_', '=', '+', '{', '}', '[', ']'],
            ['\\','|', ';', ':', "'", '"', ',', '.', '<', '>'],
            ['/', '?', '`' ,'~'],
        ];
        let result: Dict<Pt> = {};
        for (let y = 0; y < spriteFontCharList.length; y++) {
            for (let x = 0; x < spriteFontCharList[y].length; x++) {
                result[spriteFontCharList[y][x]] = { x, y };
            }
        }
        result[' '] = { x: -1, y: -1 };
        return result;
    }
}

namespace SpriteText {
    export class Character {
        char: string;
        x: number;
        y: number;
        font: SpriteText.Font;
        style: Style;

        get width() {
            return this.font.charWidth;
        }

        get height() {
            return this.font.charHeight;
        }

        get left() {
            return this.x;
        }

        get right() {
            return this.x + this.width;
        }

        get top() {
            return this.y;
        }

        get bottom() {
            return this.y + this.height;
        }
    }

    export function getHeightOfCharList(list: SpriteText.Character[]) {
        if (_.isEmpty(list)) return 0;
        return M.max(list, char => char.y + char.height);
    }

    export const NOOP_TAG = 'noop';
    export const DEFAULT_TAGS: Dict<TagFunction> = {
        [NOOP_TAG]: (params) => {
            return {};
        },
        'y': (params) => {
            return { color: 0xFFFF00 };
        },
        'o': (params) => {
            return { offset: getInt(params[0], 0) };
        }
    }

    function getInt(text: string, def: number) {
        let result = parseInt(text);
        if (!isFinite(result)) return def;
        return result;
    }
}