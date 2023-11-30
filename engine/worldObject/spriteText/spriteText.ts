/// <reference path="../worldObject.ts" />
/// <reference path="../../utils/vector.ts" />

namespace SpriteText {
    export type Config<WO extends SpriteText> = WorldObject.Config<WO> & {
        font?: string;
        text?: string;
        justify?: Justify;
        anchor?: Vector2;
        flipX?: boolean;
        flipY?: boolean;
        angle?: number;
        scale?: number;
        scaleX?: number;
        scaleY?: number;
        maxWidth?: number;
        wordWrap?: boolean;
        fixedCharSize?: boolean;
        style?: Style;
        tint?: number;
        alpha?: number;
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

    export type Justify = 'left' | 'center' | 'right';

    export type Style = {
        color?: number;
        alpha?: number;
        offsetX?: number;
        offsetY?: number;
        filters?: PixiFilter[];
    }

    export type TagData = {
        tag: string;
        params: string[];
    }
    export type TagFunction = (params: string[]) => SpriteText.Style;
}

class SpriteText extends WorldObject {
    protected font: SpriteText.Font;
    private _fontKey: string;
    get fontKey() { return this._fontKey; }
    private chars!: SpriteTextParser.Character[][];

    // This does not need to dirty the SpriteText when modified.
    style: Required<SpriteText.Style>;

    private _maxWidth: number;
    get maxWidth() { return this._maxWidth; }
    set maxWidth(value: number) {
        if (this._maxWidth === value) return;
        this._maxWidth = value;
        this.markDirty();
    }

    private _wordWrap: boolean;
    get wordWrap() { return this._wordWrap; }
    set wordWrap(value: boolean) {
        if (this._wordWrap === value) return;
        this._wordWrap = value;
        this.markDirty();
    }

    private _fixedCharSize: boolean;
    get fixedCharSize() { return this._fixedCharSize; }
    set fixedCharSize(value: boolean) {
        if (this._fixedCharSize === value) return;
        this._fixedCharSize = value;
        this.markDirty();
    }

    private _visibleCharCount: number;
    get visibleCharCount() { return this._visibleCharCount; }
    set visibleCharCount(value: number) {
        this._visibleCharCount = value;
        this.markDirty();
    }

    private _justify: SpriteText.Justify;
    get justify() { return this._justify; }
    set justify(value: SpriteText.Justify) {
        this._justify = value;
        this.markDirty();
    }

    readonly anchor: SpriteText.DirtyAnchor;

    tint: number;
    alpha: number;
    flipX: boolean;
    flipY: boolean;
    angle: number;

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
    mask?: Mask.WorldObjectMaskConfig;

    private renderSystem?: SpriteTextRenderSystem;
    private currentText!: string;

    constructor(config: SpriteText.Config<SpriteText>) {
        super(config);

        this._fontKey = config.font ?? SpriteText.DEFAULT_FONT;
        this.font = SpriteText.getFontByName(this._fontKey);

        this.style = O.withDefaults(config.style ?? {}, {
            color: 0xFFFFFF,
            alpha: 1,
            offsetX: 0,
            offsetY: 0,
            filters: [],
        });

        this._visibleCharCount = Infinity;
        this._maxWidth = config.maxWidth ?? Infinity;
        this._wordWrap = config.wordWrap ?? true;
        this._fixedCharSize = config.fixedCharSize ?? false;
        this._justify = config.justify ?? 'left';

        this.anchor = new SpriteText.DirtyAnchor(config.anchor ?? Anchor.TOP_LEFT, () => this.markDirty());

        this.tint = config.tint ?? 0xFFFFFF;
        this.alpha = config.alpha ?? 1;
        this.flipX = config.flipX ?? false;
        this.flipY = config.flipY ?? false;
        this.angle = config.angle ?? 0;
        this.scaleX = config.scaleX ?? (config.scale ?? 1);
        this.scaleY = config.scaleY ?? (config.scale ?? 1);

        this.effects = new Effects();
        this.effects.updateFromConfig(config.effects);

        this.mask = config.mask;

        this.setText(config.text ?? "");
        this.markDirty();
    }

    override onRemove(): void {
        super.onRemove();
        this.markDirty();
    }

    override update() {
        super.update();
        this.effects.updateEffects(this.delta);

        for (let key in this.tagCache) {
            let filters = this.tagCache[key].filters;
            if (A.isEmpty(filters)) continue;
            for (let filter of filters) {
                filter.updateTime(this.delta);
            }
        }
    }

    override compile(x: number, y: number): CompileResult {
        // TODO PIXI do not ignore the result of super.compile()
        return this.getRenderSystem().compile(x, y, this);
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
        return this.chars.flat();
    }

    getVisibleCharList(visibleCharCount: number = this.visibleCharCount) {
        let chars = this.chars.flat();
        return chars.slice(0, Math.min(visibleCharCount, chars.length));
    }

    getCurrentText() {
        return this.currentText;
    }

    getStyleFromTags(tagData: SpriteText.TagData[], defaults: Required<SpriteText.Style>) {
        let result: SpriteText.Style = { filters: [] };
        for (let data of tagData) {
            let style = this.getTagStyle(data.tag, data.params);
            if (style.color !== undefined) result.color = style.color;
            if (style.alpha !== undefined) result.alpha = style.alpha;
            if (style.offsetX !== undefined) result.offsetX = style.offsetX;
            if (style.offsetY !== undefined) result.offsetY = style.offsetY;
            if (!A.isEmpty(style.filters)) result.filters!.push(...style.filters);
        }

        return O.defaults(result, defaults);
    }

    getTextWidth() {
        return SpriteText.getBoundsOfCharList(this.getCharList()).width * this.scaleX;
    }

    getTextHeight() {
        return SpriteText.getBoundsOfCharList(this.getCharList()).height * this.scaleY;
    }

    override getVisibleLocalBounds$(): Rectangle | undefined {
        let bounds = this.getRenderSystem().getSpriteTextLocalBounds(this);
        return Rectangle.fromBoundaries(bounds);
    }

    markDirty() {
        this.renderSystem?.free();
        this.renderSystem = undefined;
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
        this.markDirty();
    }

    setText(text: string) {
        if (text === this.currentText) return;
        this.chars = SpriteText.textToCharList({
            text: text,
            font: this.font,
            maxWidth: this.maxWidth,
            wordWrap: this.wordWrap,
            fixedCharSize: this.fixedCharSize,
        });
        this.currentText = text;
        this.markDirty();
    }

    // May still need work
    toTexture() {
        let width = this.getTextWidth();
        let height = this.getTextHeight();
        let texture = PIXI.RenderTexture.create({ width, height });

        let anchorOffsetX = Math.round(this.anchor.x * width);
        let anchorOffsetY = Math.round(this.anchor.y * height);

        let compileResult = this.compile(anchorOffsetX, anchorOffsetY);
        if (compileResult) Main.renderer.render(compileResult, texture, false);

        texture.defaultAnchor.set(this.anchor.x, this.anchor.y);

        return texture;
    }

    private getRenderSystem() {
        if (!this.renderSystem) {
            SpriteText.justify(this.chars, this.justify);
            this.renderSystem = SpriteTextRenderer.getRenderSystem(this.getVisibleCharList());
        }
        return this.renderSystem;
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

    static DEFAULT_FONT: string = 'deluxe16';
}

namespace SpriteText {
    export function addTags(tags: Dict<TagFunction>) {
        for (let key in tags) {
            if (key in SpriteText.TAGS) {
                debug(`A SpriteText tag already exists with name ${key}:`, SpriteText.TAGS[key]);
            }
            SpriteText.TAGS[key] = tags[key];
        }
    }

    export function getFontByName(fontName: string | undefined) {
        let font = AssetCache.getFont(fontName ?? SpriteText.DEFAULT_FONT);
        return font ?? {
            charTextures: {},
            charWidth: 0,
            charHeight: 0,
            spaceWidth: 0,
            newlineHeight: 0,
        };
    }

    export function getBoundsOfCharList(list: SpriteTextParser.Character[]) {
        if (A.isEmpty(list)) return new Rectangle(0, 0, 0, 0);

        let left = M.min(list, char => char.left);
        let right = M.max(list, char => char.right);
        let top = M.min(list, char => char.top);
        let bottom = M.max(list, char => char.bottom);

        return new Rectangle(left, top, right-left, bottom-top);
    }

    export function justify(lines: SpriteTextParser.Character[][], justify: SpriteText.Justify) {
        let maxWidth = SpriteText.getBoundsOfCharList(lines.flat()).width;
        for (let line of lines) {
            if (line.length === 0) continue;
            let lineWidth = SpriteText.getBoundsOfCharList(line).width;
            let lineLeft = (maxWidth - lineWidth) * justifyToX(justify);
            let minLeft = M.min(line, char => char.left);
            let dx = lineLeft - minLeft;
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

    export function textToCharList(props: { text: string, font: SpriteText.Font, maxWidth: number, wordWrap: boolean, fixedCharSize: boolean }) {
        let { text, font, maxWidth, wordWrap, fixedCharSize } = props;
        if (!text) return [];

        let tokens = SpriteTextTokenizer.tokenize(text);
        let lexemes = SpriteTextLexer.lex(tokens, wordWrap);
        let result = SpriteTextParser.parse({ lexemes, font, maxWidth, fixedCharSize });

        return result;
    }

    export class DirtyAnchor {
        private _x: number;
        get x() { return this._x; }
        set x(v) {
            if (this._x === v) return;
            this._x = v;
            this.markDirty();
        }

        private _y: number;
        get y() { return this._y; }
        set y(v) {
            if (this._y === v) return;
            this._y = v;
            this.markDirty();
        }

        private markDirty: () => void;

        constructor(anchor: Pt, markDirty: () => void) {
            this._x = anchor.x;
            this._y = anchor.y;
            this.markDirty = markDirty;
        }
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

    function getInt(text: string, def: number | undefined) {
        let result = parseInt(text);
        if (!isFinite(result)) return def;
        return result;
    }

    function getFloat(text: string, def: number | undefined) {
        let result = parseFloat(text);
        if (!isFinite(result)) return def;
        return result;
    }
}