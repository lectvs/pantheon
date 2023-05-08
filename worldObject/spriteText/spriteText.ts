/// <reference path="../worldObject.ts" />

namespace SpriteText {
    export type Config = ReplaceConfigCallbacks<WorldObject.Config, SpriteText> & {
        font?: string;
        text?: string;
        justify?: Justify;
        anchor?: Vector2;
        alpha?: number;
        flipX?: boolean;
        flipY?: boolean;
        scale?: number;
        scaleX?: number;
        scaleY?: number;
        angle?: number;
        angleOffset?: number;
        maxWidth?: number;
        style?: Style;
        effects?: Effects.Config;
        mask?: TextureFilters.Mask.WorldObjectMaskConfig;
    }

    export type Font = {
        charTextures: Dict<string>;
        charWidth: number;
        charHeight: number;
        spaceWidth: number;
        newlineHeight: number;
    }

    export type Justify = 'left' | 'center' | 'right';

    export type Style = {
        color?: number;
        alpha?: number;
        offsetX?: number;
        offsetY?: number;
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
    private chars: SpriteText.Character[][];

    private _style: Required<SpriteText.Style>;
    get style() { return this._style; }
    set style(value: Required<SpriteText.Style>) {
        this._style.alpha = value.alpha;
        this._style.color = value.color;
        this._style.offsetX = value.offsetX;
        this._style.offsetY = value.offsetY;
        this._style.filters = A.clone(value.filters);
    }

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

    private _justify: SpriteText.Justify;
    get justify() { return this._justify; }
    set justify(value: SpriteText.Justify) {
        this._justify = value;
        this.dirty = true;
    }

    anchor: Vector2;

    alpha: number;
    flipX: boolean;
    flipY: boolean;
    angle: number;
    angleOffset: number;

    scaleX: number;
    scaleY: number;
    get scale() {
        if (this.scaleX !== this.scaleY) console.error('Warning: scaleX and scaleY differ! Attempted to get scale!');
        return this.scaleX;
    }
    set scale(value: number) {
        this.scaleX = value;
        this.scaleY = value;
    }

    effects: Effects;
    mask: TextureFilters.Mask.WorldObjectMaskConfig;

    private staticTextures: Dict<SpriteText.StaticTextureData>;
    private currentText: string;
    private dirty: boolean;

    constructor(config: SpriteText.Config) {
        super(config);

        if (config.font || SpriteText.DEFAULT_FONT) {
            this._fontKey = config.font ?? SpriteText.DEFAULT_FONT;
            this.font = AssetCache.getFont(this._fontKey);
        } else {
            console.error("SpriteText must have a font provided, or a default font set");
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

        this._style = _.defaults(O.deepClone(config.style ?? {}), requireType<Required<SpriteText.Style>>({
            color: 0xFFFFFF,
            alpha: 1,
            offsetX: 0,
            offsetY: 0,
            filters: [],
        }));

        this.visibleCharCount = Infinity;

        this.maxWidth = config.maxWidth ?? Infinity;

        this.anchor = config.anchor ?? Vector2.TOP_LEFT;
        this.justify = config.justify ?? 'left';

        this.alpha = config.alpha ?? 1;
        this.flipX = config.flipX ?? false;
        this.flipY = config.flipY ?? false;
        this.scaleX = config.scaleX ?? (config.scale ?? 1);
        this.scaleY = config.scaleY ?? (config.scale ?? 1);
        this.angle = config.angle ?? 0;
        this.angleOffset = config.angleOffset ?? 0;

        this.effects = new Effects();
        this.effects.updateFromConfig(config.effects);

        this.mask = config.mask;

        this.setText(config.text ?? "");
        this.dirty = true;
    }

    onRemove(): void {
        super.onRemove();
        SpriteTextConverter.returnStaticTextures(this.staticTextures);
        this.staticTextures = undefined;
        this.dirty = true;
    }

    update() {
        super.update();
        this.effects.updateEffects(this.delta);

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
                x: x + anchorOffsetX + (data.x + style.offsetX) * (this.flipX ? -1 : 1) * this.scaleX,
                y: y + anchorOffsetY + (data.y + style.offsetY) * (this.flipY ? -1 : 1) * this.scaleY,
                tint: style.color,
                alpha: this.alpha * style.alpha,
                scaleX: (this.flipX ? -1 : 1) * this.scaleX,
                scaleY: (this.flipY ? -1 : 1) * this.scaleY,
                angle: this.angle + this.angleOffset,
                filters: [...style.filters, ...this.effects.getFilterList()],
                mask: TextureFilters.Mask.getTextureMaskForWorldObject(this.mask, this, x, y),
            });
        }

        super.render(texture, x, y);
    }

    renderSpriteText() {
        SpriteText.justify(this.chars, this.justify);

        let chars = _.flatten(this.chars);
        let charCount = Math.min(this.visibleCharCount, chars.length);

        SpriteTextConverter.returnStaticTextures(this.staticTextures);
        this.staticTextures = SpriteTextConverter.getStaticTexturesForCharList(chars, charCount);

        for (let i = 0; i < charCount; i++) {
            let char = chars[i];
            let charTexture = AssetCache.getTexture(this.font.charTextures[char.char]);

            let staticTextureData = this.staticTextures[char.part];

            charTexture.renderTo(staticTextureData.texture, {
                x: char.x - staticTextureData.x,
                y: char.y - staticTextureData.y,
            });
        }
    }

    addText(text: string) {
        this.setText(`${this.currentText}${text}`);
    }

    allCharactersVisible() {
        return this.visibleCharCount >= this.getCharList().length;
    }

    clear() {
        this.setText("");
    }

    getCharList() {
        return <SpriteText.Character[]>_.flatten(this.chars);
    }

    getCurrentText() {
        return this.currentText;
    }

    getTextWidth() {
        return SpriteText.getWidthOfCharList(_.flatten(this.chars), this.visibleCharCount) * this.scaleX;
    }

    getTextHeight() {
        return SpriteText.getHeightOfCharList(_.flatten(this.chars), this.visibleCharCount) * this.scaleY;
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
            console.error(`Cannot set SpriteText font, font not found: ${fontKey}`);
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

    // May still need work
    toTexture() {
        let width = this.getTextWidth();
        let height = this.getTextHeight();
        let texture = new BasicTexture(width, height, 'SpriteText.toTexture', false);

        let anchorOffsetX = Math.round(this.anchor.x * width);
        let anchorOffsetY = Math.round(this.anchor.y * height);
        this.render(texture, anchorOffsetX, anchorOffsetY);

        return new AnchoredTexture(texture, this.anchor.x, this.anchor.y);
    }

    private getStyleFromTags(tagData: SpriteText.TagData[], defaults: Required<SpriteText.Style>) {
        let result: SpriteText.Style = { filters: [] };
        for (let data of tagData) {
            let style = this.getTagStyle(data.tag, data.params);
            if (style.color !== undefined) result.color = style.color;
            if (style.alpha !== undefined) result.alpha = style.alpha;
            if (style.offsetX !== undefined) result.offsetX = style.offsetX;
            if (style.offsetY !== undefined) result.offsetY = style.offsetY;
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
            console.error(`Tag not found: ${name}`);
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

        let min = M.min(list, char => char.left);
        let max = M.max(list, char => char.right);

        return max - min;
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

    export function justify(lines: SpriteText.Character[][], justify: SpriteText.Justify) {
        let maxWidth = SpriteText.getWidthOfCharList(_.flatten(lines));
        for (let line of lines) {
            if (line.length === 0) continue;
            let lineWidth = SpriteText.getWidthOfCharList(line);
            let lineX = (maxWidth - lineWidth) * justifyToX(justify);
            let minX = M.min(line, char => char.x);
            let dx = lineX - minX;
            for (let char of line) {
                char.x += dx;
            }
        }
    }

    function justifyToX(justify: SpriteText.Justify) {
        if (justify === 'left') return 0;
        if (justify === 'center') return 0.5;
        return 1;
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
        'offset': (params) => {
            return { offsetX: getFloat(params[0], undefined), offsetY: getFloat(params[1], undefined) };
        },
        'offsetx': (params) => {
            return { offsetX: getFloat(params[0], undefined) };
        },
        'offsety': (params) => {
            return { offsetY: getFloat(params[0], undefined) };
        },
    }

    function getInt(text: string, def: number) {
        let result = parseInt(text);
        if (!isFinite(result)) return def;
        return result;
    }

    function getFloat(text: string, def: number) {
        let result = parseFloat(text);
        if (!isFinite(result)) return def;
        return result;
    }
}