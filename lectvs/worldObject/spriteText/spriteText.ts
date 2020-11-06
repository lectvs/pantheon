/// <reference path="../worldObject.ts" />

namespace SpriteText {
    export type Config = ReplaceConfigCallbacks<WorldObject.Config, SpriteText> & {
        font?: Font;
        text?: string;
        anchor?: Pt;
        maxWidth?: number;
        style?: Style;
        effects?: Effects.Config;
        mask?: Mask.WorldObjectMaskConfig;
    }

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
    private _font: SpriteText.Font;
    get font() { return this._font; }
    private chars: SpriteText.Character[];

    private _style: SpriteText.Style;
    get style() { return this._style; }
    set style(value: SpriteText.Style) {
        this._style.alpha = value.alpha;
        this._style.color = value.color;
        this._style.offset = value.offset;
    }
    private lastStyle: SpriteText.Style;

    private maxWidth: number;

    anchor: Pt;

    effects: Effects;
    mask: Mask.WorldObjectMaskConfig;

    private staticTexture: Texture;
    private currentText: string;
    private dirty: boolean;

    constructor(config: SpriteText.Config) {
        super(config);

        if (!config.font && !SpriteText.DEFAULT_FONT) {
            error("SpriteText must have a font provided, or a default font set");
        }

        this._font = config.font ?? SpriteText.DEFAULT_FONT ?? {
            texturePrefix: 'none',
            charWidth: 0,
            charHeight: 0,
            spaceWidth: 0,
            newlineHeight: 0
        };

        this._style = _.defaults(O.deepClone(config.style ?? {}), {
            color: 0xFFFFFF,
            alpha: 1,
            offset: 0,
        });

        this.lastStyle = O.deepClone(this.style);

        this.maxWidth = config.maxWidth ?? 0;
        this.anchor = config.anchor ?? Anchor.TOP_LEFT;
        this.effects = new Effects();
        this.effects.updateFromConfig(config.effects);

        this.mask = config.mask;

        this.setText(config.text ?? "");
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
            let charTexture = AssetCache.getTexture(`${this.font.texturePrefix}_${char_i}`);
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
        this.setText("");
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

    pushChar(char: SpriteText.Character) {
        this.chars.push(char);
        this.dirty = true;
        // Set text to undefined so any text update will not short-circuit.
        this.currentText = undefined;
    }

    setMaxWidth(maxWidth: number) {
        this.maxWidth = maxWidth;
        this.dirty = true;
    }

    setText(text: string) {
        if (text === this.currentText) return;
        this.chars = SpriteTextConverter.textToCharListWithWordWrap(text, this.font, this.maxWidth);
        this.currentText = text;
        this.dirty = true;
    }

    static DEFAULT_FONT: SpriteText.Font = null;
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