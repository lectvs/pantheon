/// <reference path="../worldObject.ts" />

namespace SpriteText {
    export type Config = ReplaceConfigCallbacks<WorldObject.Config, SpriteText> & {
        font?: string;
        text?: string;
        anchor?: Vector2;
        alpha?: number;
        flipX?: boolean;
        flipY?: boolean;
        scaleX?: number;
        scaleY?: number;
        angle?: number;
        maxWidth?: number;
        style?: Style;
        effects?: Effects.Config;
        mask?: Mask.WorldObjectMaskConfig;
    }

    export type Font = {
        charTextures: Dict<string>;
        charWidth: number;
        charHeight: number;
        spaceWidth: number;
        newlineHeight: number;
    }

    export type Style = {
        color?: number;
        alpha?: number;
        filters?: TextureFilter[];
    }

    export type TagData = {
        tag: string;
        params: string[];
    }
    export type TagFunction = (params: string[]) => SpriteText.Style;

    export type StaticTextureData = {
        x: number;
        y: number;
        texture: Texture;
        tagData: TagData[];
    }
}

class SpriteText extends WorldObject {
    protected font: SpriteText.Font;
    private _fontKey: string;
    get fontKey() { return this._fontKey; }
    private chars: SpriteText.Character[];

    private _style: Required<SpriteText.Style>;
    get style() { return this._style; }
    set style(value: Required<SpriteText.Style>) {
        this._style.alpha = value.alpha;
        this._style.color = value.color;
    }
    private lastStyle: Required<SpriteText.Style>;

    private _maxWidth: number;
    get maxWidth() { return this._maxWidth; }
    set maxWidth(value: number) {
        if (this._maxWidth === value) return;
        this._maxWidth = value;
        this.dirty = true;
    }

    private _visibleCharCount: number;
    get visibleCharCount() { return this._visibleCharCount; }
    set visibleCharCount(value: number) {
        this._visibleCharCount = value;
        this.dirty = true;
    }

    anchor: Vector2;

    alpha: number;
    flipX: boolean;
    flipY: boolean;
    scaleX: number;
    scaleY: number;
    angle: number;

    effects: Effects;
    mask: Mask.WorldObjectMaskConfig;

    private staticTextures: Dict<SpriteText.StaticTextureData>;
    private currentText: string;
    private dirty: boolean;

    constructor(config: SpriteText.Config) {
        super(config);

        if (config.font || SpriteText.DEFAULT_FONT) {
            this._fontKey = config.font ?? SpriteText.DEFAULT_FONT;
            this.font = AssetCache.getFont(this._fontKey);
        } else {
            error("SpriteText must have a font provided, or a default font set");
        }

        if (!this.font) {
            this.font = {
                charTextures: {},
                charWidth: 0,
                charHeight: 0,
                spaceWidth: 0,
                newlineHeight: 0
            };
        }

        this._style = _.defaults(O.deepClone(config.style ?? {}), {
            color: 0xFFFFFF,
            alpha: 1,
            filters: [],
        });
        this.lastStyle = O.deepClone(this.style);

        this.visibleCharCount = Infinity;

        this.maxWidth = config.maxWidth ?? Infinity;

        this.anchor = config.anchor ?? Vector2.TOP_LEFT;

        this.alpha = config.alpha ?? 1;
        this.flipX = config.flipX ?? false;
        this.flipY = config.flipY ?? false;
        this.scaleX = config.scaleX ?? 1;
        this.scaleY = config.scaleY ?? 1;
        this.angle = config.angle ?? 0;

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

        for (let key in this.tagCache) {
            if (_.isEmpty(this.tagCache[key].filters)) continue;
            for (let filter of this.tagCache[key].filters) {
                filter.updateTime(this.delta);
            }
        }
    }

    render(texture: Texture, x: number, y: number) {
        if (this.dirty) {
            this.renderSpriteText();
            this.dirty = false;
        }

        let anchorOffsetX = Math.round(-this.anchor.x * this.getTextWidth());
        let anchorOffsetY = Math.round(-this.anchor.y * this.getTextHeight());

        for (let key in this.staticTextures) {
            let data = this.staticTextures[key];
            let style = this.getStyleFromTags(data.tagData, this.style);
            data.texture.renderTo(texture, {
                x: x + anchorOffsetX + data.x,
                y: y + anchorOffsetY + data.y,
                tint: style.color,
                alpha: this.alpha * style.alpha,
                scaleX: (this.flipX ? -1 : 1) * this.scaleX,
                scaleY: (this.flipY ? -1 : 1) * this.scaleY,
                angle: this.angle,
                filters: [...style.filters, ...this.effects.getFilterList()],
                mask: Mask.getTextureMaskForWorldObject(this.mask, this),
            });
        }

        super.render(texture, x, y);
    }

    renderSpriteText() {
        let charCount = Math.min(this.visibleCharCount, this.chars.length);

        this.staticTextures = SpriteTextConverter.getStaticTexturesForCharList(this.chars, charCount);

        for (let i = 0; i < charCount; i++) {
            let char = this.chars[i];
            let charTexture = AssetCache.getTexture(this.font.charTextures[char.char]);

            let staticTextureData = this.staticTextures[char.part];

            charTexture.renderTo(staticTextureData.texture, {
                x: char.x - staticTextureData.x,
                y: char.y - staticTextureData.y,
            });
        }
    }

    clear() {
        this.setText("");
    }

    getCharList() {
        return this.chars;
    }

    getCurrentText() {
        return this.currentText;
    }

    getTextWidth() {
        return SpriteText.getWidthOfCharList(this.chars, this.visibleCharCount) * this.scaleX;
    }

    getTextHeight() {
        return SpriteText.getHeightOfCharList(this.chars, this.visibleCharCount) * this.scaleY;
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
        bounds.x += this.getRenderScreenX() - this.x;
        bounds.y += this.getRenderScreenY() - this.y;
        return bounds;
    }

    setFont(fontKey: string) {
        if (fontKey === this.fontKey) return;
        let font = AssetCache.getFont(fontKey);
        if (!font) {
            error(`Cannot set SpriteText font, font not found: ${fontKey}`);
            return;
        }
        this.font = font;
        this._fontKey = fontKey;
        this.dirty = true;
    }

    setText(text: string) {
        if (text === this.currentText) return;
        this.chars = SpriteTextConverter.textToCharListWithWordWrap(text, this.font, this.maxWidth);
        this.currentText = text;
        this.dirty = true;
    }

    private getStyleFromTags(tagData: SpriteText.TagData[], defaults: Required<SpriteText.Style>) {
        let result: SpriteText.Style = { filters: [] };
        for (let data of tagData) {
            let style = this.getTagStyle(data.tag, data.params);
            if (style.color !== undefined) result.color = style.color;
            if (style.alpha !== undefined) result.alpha = style.alpha;
            if (!_.isEmpty(style.filters)) result.filters.push(...style.filters);
        }

        _.defaults(result, defaults);
        return result;
    }

    private getTagStyle(name: string, params: string[]) {
        let cacheKey = [name, ...params].join(' ');
        if (cacheKey in this.tagCache) {
            return this.tagCache[cacheKey];
        }
        let tag = SpriteText.TAGS[name];
        if (!tag) {
            error(`Tag not found: ${name}`);
            tag = SpriteText.TAGS[SpriteText.NOOP_TAG];
        }

        let style = tag(params);
        this.tagCache[cacheKey] = style;
        return style;
    }

    private readonly tagCache: Dict<SpriteText.Style> = {};

    static DEFAULT_FONT: string = undefined;
}

namespace SpriteText {
    export class Character {
        char: string;
        x: number;
        y: number;
        width: number;
        height: number;
        part: number;
        tagData: TagData[];

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

    export function getWidthOfCharList(list: SpriteText.Character[], charCount?: number) {
        if (_.isEmpty(list)) return 0;
        charCount = Math.min(charCount ?? list.length, list.length);

        let result = 0;
        for (let i = 0; i < charCount; i++) {
            if (list[i].right > result) result = list[i].right;
        }

        return result;
    }

    export function getHeightOfCharList(list: SpriteText.Character[], charCount?: number) {
        if (_.isEmpty(list)) return 0;
        charCount = Math.min(charCount ?? list.length, list.length);

        let result = 0;
        for (let i = 0; i < charCount; i++) {
            if (list[i].bottom > result) result = list[i].bottom;
        }

        return result;
    }

    export const NOOP_TAG = 'noop';
    export const TAGS: Dict<TagFunction> = {
        [NOOP_TAG]: (params) => {
            return {};
        },
        'y': (params) => {
            return { color: 0xFFFF00 };
        },
        'g': (params) => {
            return { color: 0x00FF00 };
        },
        'r': (params) => {
            return { color: 0xFF0000 };
        },
        'color': (params) => {
            return { color: getInt(params[0], undefined) };
        },
    }

    function getInt(text: string, def: number) {
        let result = parseInt(text);
        if (!isFinite(result)) return def;
        return result;
    }
}