/// <reference path="../worldObject.ts" />

namespace SpriteText {
    export type Font = {
        texturePrefix: string;
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
    chars: SpriteText.Character[];

    private _style: SpriteText.Style;
    get style() { return this._style; }

    private lastStyle: SpriteText.Style;

    anchor: Pt;

    effects: Effects;
    mask: Mask.WorldObjectMaskConfig;

    private staticTexture: Texture;
    private currentText: string;
    dirty: boolean;

    constructor(font: SpriteText.Font, text: string = "") {
        super();

        this.font = font;

        this._style = {
            color: 0xFFFFFF,
            alpha: 1,
            offset: 0,
        };

        this.lastStyle = O.deepClone(this.style);

        this.anchor = Anchor.TOP_LEFT;
        this.effects = new Effects();
        this.mask = null;

        this.setText(text);
        this.dirty = true;
    }

    update() {
        super.update();
        this.effects.updateEffects(this.delta);

        if (!_.isEqual(this.lastStyle, this.style)) {
            this.lastStyle = O.deepClone(this.style);
            this.dirty = true;
        }
    }

    render(texture: Texture, x: number, y: number) {
        let textWidth = this.getTextWidth();
        let textHeight = this.getTextHeight();

        if (this.dirty) {
            this.renderSpriteText();
            this.dirty = false;
        }

        this.staticTexture.renderTo(texture, {
            x: x - this.anchor.x * textWidth,
            y: y - this.anchor.y * textHeight,
            filters: this.effects.getFilterList(),
            mask: Mask.getTextureMaskForWorldObject(this.mask, this),
        });

        super.render(texture, x, y);
    }

    renderSpriteText() {
        let textWidth = this.getTextWidth();
        let textHeight = this.getTextHeight();
        this.staticTexture = new BasicTexture(textWidth, textHeight);

        for (let char of this.chars) {
            global.metrics.startSpan(`char_${char.char}`);
            let char_i = SpriteText.charCodes[char.char].y * 10 + SpriteText.charCodes[char.char].x;
            let charTexture = AssetCache.getTexture(`${this.font.texturePrefix}${char_i}`);
            charTexture.renderTo(this.staticTexture, {
                x: char.x,
                y: char.y + (char.style.offset ?? this.style.offset),
                tint: char.style.color ?? this.style.color,
                alpha: char.style.alpha ?? this.style.alpha,
            });
            global.metrics.endSpan(`char_${char.char}`);
        }
    }

    clear() {
        this.setText("", true);
    }

    getTextWidth() {
        return SpriteText.getWidthOfCharList(this.chars);
    }

    getTextHeight() {
        return SpriteText.getHeightOfCharList(this.chars);
    }

    getTextWorldBounds() {
        let textWidth = this.getTextWidth();
        let textHeight = this.getTextHeight();
        return <Rect>{
            x: this.x - this.anchor.x * textWidth,
            y: this.y - this.anchor.y * textHeight,
            width: textWidth,
            height: textHeight,
        };
    }

    getVisibleScreenBounds() {
        let bounds = this.getTextWorldBounds();
        bounds.x += this.renderScreenX - this.x;
        bounds.y += this.renderScreenY - this.y;
        return bounds;
    }

    setStyle(style: SpriteText.Style) {
        O.deepOverride(this.style, style);
        this.dirty = true;
    }

    setText(text: string, force: boolean = false) {
        // TODO: remove force parameter after rewriting dialog box
        if (!force && text === this.currentText) return;
        this.chars = SpriteTextConverter.textToCharListWithWordWrap(text, this.font, 0);
        this.currentText = text;
        this.dirty = true;
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