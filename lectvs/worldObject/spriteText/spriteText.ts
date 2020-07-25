/// <reference path="../worldObject.ts" />

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
        newlineHeight: number;
    }

    export type Style = {
        color?: number;
        alpha?: number;
        offset?: number;
    }

    export type TagFunction = (params: string[]) => SpriteText.Style;
}

class SpriteText extends WorldObject {
    font: SpriteText.Font;
    style: SpriteText.Style;
    chars: SpriteText.Character[];

    mask: Texture;

    private fontTexture: Texture;

    constructor(config: SpriteText.Config) {
        super(config);
        this.font = config.font;
        this.style = O.withDefaults(config.style, {
            color: 0xFFFFFF,
            alpha: 1,
            offset: 0,
        });
        this.setText(config.text);

        this.fontTexture = AssetCache.getTexture(this.font.texture);
    }

    render(screen: Texture) {
        let filters = this.mask ? [new TextureFilter.Mask({ type: TextureFilter.Mask.Type.GLOBAL, mask: this.mask})] : [];
        for (let char of this.chars) {
            this.fontTexture.renderTo(screen, {
                x: this.renderScreenX + char.x,
                y: this.renderScreenY + char.y + (char.style.offset ?? this.style.offset),
                tint: char.style.color ?? this.style.color,
                alpha: char.style.alpha ?? this.style.alpha,
                slice: {
                    x: SpriteText.charCodes[char.char].x * this.font.charWidth,
                    y: SpriteText.charCodes[char.char].y * this.font.charHeight,
                    width: this.font.charWidth,
                    height: this.font.charHeight
                },
                filters: filters,
            });
        }
        super.render(screen);
    }

    clear() {
        this.setText("");
    }

    getTextWidth() {
        return SpriteText.getWidthOfCharList(this.chars);
    }

    getTextHeight() {
        return SpriteText.getHeightOfCharList(this.chars);
    }

    getTextWorldBounds(): Rect {
        // TODO: adjust for alignment
        return { x: this.x, y: this.y, width: this.getTextWidth(), height: this.getTextHeight() };
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

    export function addTags(tags: Dict<TagFunction>) {
        for (let key in tags) {
            if (key in SpriteText.TAGS) {
                debug(`A SpriteText tag already exists with name ${key}:`, SpriteText.TAGS[key]);
            }
            SpriteText.TAGS[key] = tags[key];
        }
    }

    export function getWidthOfCharList(list: SpriteText.Character[]) {
        if (_.isEmpty(list)) return 0;
        return M.max(list, char => char.x + char.width);
    }

    export function getHeightOfCharList(list: SpriteText.Character[]) {
        if (_.isEmpty(list)) return 0;
        return M.max(list, char => char.y + char.height);
    }

    export const NOOP_TAG = 'noop';
    export const TAGS: Dict<TagFunction> = {
        [NOOP_TAG]: (params) => {
            return {};
        },
        'y': (params) => {
            return { color: 0xFFFF00 };
        },
        'color': (params) => {
            return { color: getInt(params[0], undefined) };
        },
        'o': (params) => {
            return { offset: getInt(params[0], 0) };
        },
    }

    function getInt(text: string, def: number) {
        let result = parseInt(text);
        if (!isFinite(result)) return def;
        return result;
    }
}