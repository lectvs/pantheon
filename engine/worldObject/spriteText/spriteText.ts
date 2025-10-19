/// <reference path="../worldObject.ts" />
/// <reference path="../../utils/vector.ts" />

namespace SpriteText {
    export type Config<WO extends SpriteText> = WorldObject.Config<WO> & {
        font?: string;
        text?: string;
        format?: string;
        justify?: Justify;
        anchor?: Vector2;
        flipX?: boolean;
        flipY?: boolean;
        offsetX?: number;
        offsetY?: number;
        angle?: number;
        vangle?: number;
        scale?: number;
        scaleX?: number;
        scaleY?: number;
        maxWidth?: number;
        spaceBetweenLines?: number;
        blankLineHeight?: number;
        wordWrap?: boolean;
        fixedCharSize?: boolean;
        style?: Style;
        effects?: Effects.Config;
        typeAnimationRate?: number;
        typeAnimationSound?: string;
        charProperties?: CharProperties,
    }

    export type Font = {
        charTextures: Dict<string>;
        charWidth: number;
        charHeight: number;
        spaceWidth: number;
        spaceBetweenLines: number;
        blankLineHeight: number;
    }

    export type Justify = 'left' | 'center' | 'right';

    export type Style = {
        color?: number | ((data: StyleDynamicData) => number);
        alpha?: number | ((data: StyleDynamicData) => number);
        offsetX?: number | ((data: StyleDynamicData) => number);
        offsetY?: number | ((data: StyleDynamicData) => number);
        filters?: TextureFilter[];
    }

    export type StyleDynamicData = {
        charName: string;
        position: number;
        t: number;
    }

    export type TagData = {
        tag: string;
        params: string[];
    }
    export type TagFunction = (params: string[]) => SpriteText.Style;

    export type CharProperties = CharPropertiesSingle & {
        byName?: Dict<CharPropertiesSingle>;
        /**
         * Position includes spaces but does not include newlines or tags.
         */
        byPosition?: DictNumber<CharPropertiesSingle>;
    }
    export type CharPropertiesSingle = {
        /**
         * Default: The char's texture anchor.
         */
        anchor?: Vector2;
        /**
         * Default: If the char is the same size as the font, uses tag data. Else, white.
         * If negative: Uses tag data.
         */
        color?: number;
        alpha?: number;
        offsetX?: number;
        offsetY?: number;
    }
}

class SpriteText extends WorldObject {
    protected font: SpriteText.Font;
    private _fontKey: string;
    get fontKey() { return this._fontKey; }
    private chars!: SpriteTextParser.Character[][];

    // This does not need to dirty the SpriteText when modified.
    style: Required<SpriteText.Style>;
    private format: string | undefined;

    private _maxWidth: number;
    get maxWidth() { return this._maxWidth; }
    set maxWidth(value: number) {
        if (this._maxWidth === value) return;
        this._maxWidth = value;
        this.freeRenderSystem();
    }

    private _spaceBetweenLines: number | undefined;
    get spaceBetweenLines() { return this._spaceBetweenLines; }
    set spaceBetweenLines(value: number | undefined) {
        if (this._spaceBetweenLines === value) return;
        this._spaceBetweenLines = value;
        this.freeRenderSystem();
    }

    private _blankLineHeight: number | undefined;
    get blankLineHeight() { return this._blankLineHeight; }
    set blankLineHeight(value: number | undefined) {
        if (this._blankLineHeight === value) return;
        this._blankLineHeight = value;
        this.freeRenderSystem();
    }

    private _wordWrap: boolean;
    get wordWrap() { return this._wordWrap; }
    set wordWrap(value: boolean) {
        if (this._wordWrap === value) return;
        this._wordWrap = value;
        this.freeRenderSystem();
    }

    private _fixedCharSize: boolean;
    get fixedCharSize() { return this._fixedCharSize; }
    set fixedCharSize(value: boolean) {
        if (this._fixedCharSize === value) return;
        this._fixedCharSize = value;
        this.freeRenderSystem();
    }

    private _visibleCharStart: number;
    get visibleCharStart() { return this._visibleCharStart; }
    set visibleCharStart(value: number) {
        this._visibleCharStart = value;
        this.freeRenderSystem();
    }

    private _visibleCharEnd: number;
    get visibleCharEnd() { return this._visibleCharEnd; }
    set visibleCharEnd(value: number) {
        this._visibleCharEnd = value;
        this.freeRenderSystem();
    }

    private _justify: SpriteText.Justify;
    get justify() { return this._justify; }
    set justify(value: SpriteText.Justify) {
        this._justify = value;
        this.freeRenderSystem();
    }

    readonly anchor: SpriteText.DirtyAnchor;

    flipX: boolean;
    flipY: boolean;
    offsetX: number;
    offsetY: number;
    angle: number;
    vangle: number;

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

    typeAnimationRate: number;
    typeAnimationSound: string | undefined;

    private charProperties: SpriteText.CharProperties;

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

        this.format = config.format;
        this._visibleCharStart = 0;
        this._visibleCharEnd = Infinity;
        this._maxWidth = config.maxWidth ?? Infinity;
        this._spaceBetweenLines = config.spaceBetweenLines;
        this._blankLineHeight = config.blankLineHeight;
        this._wordWrap = config.wordWrap ?? true;
        this._fixedCharSize = config.fixedCharSize ?? true;
        this._justify = config.justify ?? 'center';

        this.anchor = new SpriteText.DirtyAnchor(config.anchor ?? Anchor.CENTER, () => this.freeRenderSystem());

        this.flipX = config.flipX ?? false;
        this.flipY = config.flipY ?? false;
        this.offsetX = config.offsetX ?? 0;
        this.offsetY = config.offsetY ?? 0;
        this.angle = config.angle ?? 0;
        this.vangle = config.vangle ?? 0;
        this.scaleX = config.scaleX ?? (config.scale ?? 1);
        this.scaleY = config.scaleY ?? (config.scale ?? 1);

        this.effects = new Effects();
        this.effects.updateFromConfig(config.effects);

        this.typeAnimationRate = config.typeAnimationRate ?? 10;
        this.typeAnimationSound = config.typeAnimationSound;
        this.addTypeAnimations();

        this.charProperties = config.charProperties ?? {};

        this.setText(config.text ?? "");
    }

    override onRemove(): void {
        super.onRemove();
        this.freeRenderSystem();
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

        this.angle += this.vangle * this.delta;
    }

    override render() {
        let result: Render.Result = FrameCache.array();
        result.pushAll(this.getRenderSystem().render());
        result.pushAll(super.render());

        // Sometimes SpriteText has no render objects (e.g. if offscreen)
        let maskSprite = this.getMaskSprite();
        if (maskSprite && result.every(r => r.mask !== maskSprite)) {
            A.removeAll(result, maskSprite);
        }

        return result;
    }

    addText(text: string) {
        this.setText(`${this.currentText}${text}`);
    }

    allCharactersVisible() {
        return this.visibleCharStart <= 0 && this.visibleCharEnd >= this.getCharList().length;
    }

    clear() {
        this.setText('');
    }

    freeRenderSystem() {
        this.renderSystem?.free();
        this.renderSystem = undefined;
    }

    getCharList() {
        return this.chars.flat();
    }

    getFormat() {
        return this.format;
    }

    getVisibleCharList(visibleCharStart: number = this.visibleCharStart, visibleCharEnd: number = this.visibleCharEnd) {
        let chars = this.chars.flat();
        return chars.slice(visibleCharStart, Math.min(visibleCharEnd, chars.length));

    }

    private getVisibleCharListByLineBreak(visibleCharStart: number = this.visibleCharStart, visibleCharEnd: number = this.visibleCharEnd) {
        let result: SpriteTextParser.Character[][] = [];

        let currentCharStart = visibleCharStart;
        let currentCharEnd = visibleCharEnd;

        for (let line of this.chars) {
            let slicedLine = line.slice(currentCharStart, Math.min(currentCharEnd, line.length));
            if (slicedLine.length > 0) result.push(slicedLine);

            currentCharStart = Math.max(currentCharStart - line.length, 0);
            currentCharEnd = Math.max(currentCharEnd - line.length, 0);

            if (currentCharEnd === 0) break;
        }

        return result;
    }

    getCurrentText() {
        return this.currentText;
    }

    getCurrentTextFormatted() {
        if (!this.format) return this.getCurrentText();
        return this.format.replaceAll('%s', this.getCurrentText());
    }

    getStyleFromTags$(tagData: SpriteText.TagData[], defaults: Required<SpriteText.Style>) {
        let result: SpriteText.Style = { filters: FrameCache.array() };
        for (let data of tagData) {
            let style = this.getTagStyle(data.tag, data.params);
            if (style.color !== undefined) result.color = style.color;
            if (style.alpha !== undefined) result.alpha = style.alpha;
            if (style.offsetX !== undefined) result.offsetX = style.offsetX;
            if (style.offsetY !== undefined) result.offsetY = style.offsetY;
            if (!A.isEmpty(style.filters)) result.filters!.pushAll(style.filters);
        }

        return O.defaults(result, defaults);
    }

    getTextWidth() {
        return SpriteText.getBoundsOfCharList$(this.getCharList()).width * this.scaleX;
    }

    getTextHeight() {
        return SpriteText.getBoundsOfCharList$(this.getCharList()).height * this.scaleY;
    }

    getVisibleTextWidth(visibleCharStart: number = this.visibleCharStart, visibleCharEnd: number = this.visibleCharEnd) {
        return SpriteText.getBoundsOfCharList$(this.getVisibleCharList(visibleCharStart, visibleCharEnd)).width * this.scaleX;
    }

    getVisibleTextHeight(visibleCharStart: number = this.visibleCharStart, visibleCharEnd: number = this.visibleCharEnd) {
        return SpriteText.getBoundsOfCharList$(this.getVisibleCharList(visibleCharStart, visibleCharEnd)).height * this.scaleY;
    }

    override getVisibleLocalBounds$(): Rectangle | undefined {
        let bounds = this.getRenderSystem().getSpriteTextLocalBounds$();
        return FrameCache.rectangle(0, 0, 0, 0).copyBoundaries(bounds);
    }

    setCharPropertyDefault<K extends keyof SpriteText.CharPropertiesSingle>(property: K, value: SpriteText.CharPropertiesSingle[K]) {
        if (this.charProperties[property] === value) return;
        this.charProperties[property] = value;
        this.freeRenderSystem();
    }

    setCharPropertyByName<K extends keyof SpriteText.CharPropertiesSingle>(charName: string, property: K, value: SpriteText.CharPropertiesSingle[K]) {
        if (!this.charProperties.byName) this.charProperties.byName = {};
        if (!this.charProperties.byName[charName]) this.charProperties.byName[charName] = {};
        if (this.charProperties.byName[charName][property] === value) return;
        this.charProperties.byName[charName][property] = value;
        this.freeRenderSystem();
    }

    setCharPropertyByPosition<K extends keyof SpriteText.CharPropertiesSingle>(charPosition: number, property: K, value: SpriteText.CharPropertiesSingle[K]) {
        if (!this.charProperties.byPosition) this.charProperties.byPosition = {};
        if (!this.charProperties.byPosition[charPosition]) this.charProperties.byPosition[charPosition] = {};
        if (this.charProperties.byPosition[charPosition][property] === value) return;
        this.charProperties.byPosition[charPosition][property] = value;
        this.freeRenderSystem();
    }

    setCharPropertyByPositionFn<K extends keyof SpriteText.CharPropertiesSingle>(property: K, valueFn: (charPosition: number, charName: string) => SpriteText.CharPropertiesSingle[K]) {
        if (!this.charProperties.byPosition) this.charProperties.byPosition = {};
        let modifiedAnyValue = false;
        for (let i = 0; i < this.chars.length; i++) {
            for (let j = 0; j < this.chars[i].length; j++) {
                let charName = this.chars[i][j].name;
                let charPosition = this.chars[i][j].position;
                if (charPosition < 0) continue;
                let value = valueFn(charPosition, charName);
                if (!this.charProperties.byPosition[charPosition]) this.charProperties.byPosition[charPosition] = {};
                if (this.charProperties.byPosition[charPosition][property] === value) continue;
                this.charProperties.byPosition[charPosition][property] = value;
                modifiedAnyValue = true;
            }
        }
        if (modifiedAnyValue) {
            this.freeRenderSystem();
        }
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
        this.freeRenderSystem();
    }

    setFormat(format: string | undefined) {
        this.format = format;
        this.setText(this.getCurrentText(), 'force');
    }

    setText(text: string, force?: 'force') {
        if (text === this.currentText && !force) return;
        this.currentText = text;
        this.setCharsFromCurrentText();
        this.freeRenderSystem();
    }

    // May still need work
    toTexture() {
        let width = this.getTextWidth();
        let height = this.getTextHeight();
        let texture = newPixiRenderTexture(width, height, 'SpriteText.toTexture');

        let anchorOffsetX = Math.round(this.anchor.x * width);
        let anchorOffsetY = Math.round(this.anchor.y * height);

        renderToRenderTexture(Render.shift(this.render(), anchorOffsetX, anchorOffsetY), texture);

        texture.defaultAnchor.set(this.anchor.x, this.anchor.y);

        return texture;
    }

    override unload(): void {
        super.unload();
        this.freeRenderSystem();
    }

    private addTypeAnimations() {
        let spriteText = this;
        if (!this.hasAnimation('type')) {
            this.addAnimation('type', Animations.fromScript({
                script: () => function*() {
                    spriteText.visibleCharEnd = 0;
                    let chars = spriteText.getCharList();
                    for (let i = 0; i < chars.length; i++) {
                        yield 1/spriteText.typeAnimationRate;
                        spriteText.visibleCharEnd++;
                        if (spriteText.typeAnimationSound) spriteText.world?.playSound(spriteText.typeAnimationSound);
                    }
                },
            }));
        }
    }

    private getRenderSystem() {
        if (!this.renderSystem) {
            this.setCharsFromCurrentText();
            SpriteText.justify(this.chars, this.justify);
            let characters = this.getVisibleCharListByLineBreak();
            let textureCreationSource = this.getCurrentText();
            this.renderSystem = new SpriteTextRenderSystem(this, characters, textureCreationSource);
        }
        return this.renderSystem;
    }

    private getTagStyle(name: string, params: string[]) {
        name = name.toLowerCase();
        let cacheKey = `${name} ${params.join(' ')}`;
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

    private setCharsFromCurrentText() {
        this.chars = SpriteText.textToCharList({
            text: this.getCurrentTextFormatted(),
            font: this.font,
            maxWidth: this.maxWidth,
            spaceBetweenLines: this.spaceBetweenLines,
            blankLineHeight: this.blankLineHeight,
            wordWrap: this.wordWrap,
            fixedCharSize: this.fixedCharSize,
            charProperties: this.charProperties,
        });
    }

    zinternal_getMaskSprite() {
        return this.getMaskSprite();
    }

    private readonly tagCache: Dict<SpriteText.Style> = {};

    static DEFAULT_FONT: string = 'deluxe16';
}

namespace SpriteText {
    export function addTags(tags: Dict<TagFunction>) {
        for (let key in tags) {
            key = key.toLowerCase();
            if (key in SpriteText.TAGS) {
                debug(`A SpriteText tag already exists with name ${key}:`, SpriteText.TAGS[key]);
            }
            SpriteText.TAGS[key] = tags[key];
        }
    }

    export function getFontByName(fontName: string | undefined): SpriteText.Font {
        let font = AssetCache.getFont(fontName ?? SpriteText.DEFAULT_FONT);
        return font ?? {
            charTextures: {},
            charWidth: 0,
            charHeight: 0,
            spaceWidth: 0,
            spaceBetweenLines: 0,
            blankLineHeight: 0,
        };
    }

    export function getBoundsOfCharList$(list: SpriteTextParser.Character[]) {
        let left = Infinity;
        let right = -Infinity;
        let top = Infinity;
        let bottom = -Infinity;

        for (let char of list) {
            if (St.isBlank(char.name)) continue;
            left = Math.min(left, char.left);
            right = Math.max(right, char.right);
            top = Math.min(top, char.top);
            bottom = Math.max(bottom, char.bottom);
        }

        let result = FrameCache.rectangle(left, top, right-left, bottom-top);

        if (!result.isFinite()) {
            result.set(0, 0, 0, 0);
        }

        return result;
    }

    export function isTagDataDynamic(tagData: SpriteText.TagData[], spriteText: SpriteText) {
        let style = spriteText.getStyleFromTags$(tagData, spriteText.style);
        for (let key in style) {
            if (O.isFunction(style[key as keyof Style])) return true;
        }
        return false;
    }

    export function justify(lines: SpriteTextParser.Character[][], justify: SpriteText.Justify) {
        let maxWidth = SpriteText.getBoundsOfCharList$(lines.flat()).width;
        for (let line of lines) {
            if (line.length === 0) continue;
            let lineWidth = SpriteText.getBoundsOfCharList$(line).width;
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

    export function tagsEqual(tagData1: TagData[], tagData2: TagData[]) {
        if (tagData1.length !== tagData2.length) return false;
        for (let i = 0; i < tagData1.length; i++) {
            if (tagData1[i].tag !== tagData2[i].tag) return false;
            if (!A.equals(tagData1[i].params, tagData2[i].params)) return false;
        }
        return true;
    }

    export function textToCharList(props: {
        text: string,
        font: SpriteText.Font,
        maxWidth: number,
        spaceBetweenLines: number | undefined,
        blankLineHeight: number | undefined,
        wordWrap: boolean,
        fixedCharSize: boolean,
        charProperties: SpriteText.CharProperties,
    }) {
        let {
            text,
            font,
            maxWidth,
            spaceBetweenLines,
            blankLineHeight,
            wordWrap,
            fixedCharSize,
            charProperties,
        } = props;

        if (!text) return [];

        let tokens = SpriteTextTokenizer.tokenize(text);
        let lexemes = SpriteTextLexer.lex(tokens, wordWrap);
        let result = SpriteTextParser.parse({
            lexemes,
            font,
            maxWidth,
            spaceBetweenLines,
            blankLineHeight,
            fixedCharSize,
            charProperties,
        });

        return result;
    }

    export function getCharProperty<K extends keyof CharPropertiesSingle>(charProperties: CharProperties, property: K, charName: string, charPosition: number): CharPropertiesSingle[K] {
        if (charProperties.byPosition && charProperties.byPosition[charPosition] && charProperties.byPosition[charPosition][property] !== undefined) {
            return charProperties.byPosition[charPosition][property];
        }

        if (charProperties.byName && charProperties.byName[charName] && charProperties.byName[charName][property] !== undefined) {
            return charProperties.byName[charName][property];
        }
        
        return charProperties[property];
    }

    /**
     * True iff there is a name- or positional- property for the character.
     */
    export function doesCharHaveTargetedProperty<K extends keyof CharPropertiesSingle>(charProperties: CharProperties, charName: string, charPosition: number) {
        if (charProperties.byPosition && charProperties.byPosition[charPosition]) {
            return true;
        }

        if (charProperties.byName && charProperties.byName[charName]) {
            return true;
        }
        
        return false;
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

        set(pt: Pt): void;
        set(x: number, y: number): void;
        set(x: number | Pt, y?: number) {
            if (typeof x !== 'number') {
                y = x.y;
                x = x.x;
            }
            this._x = x;
            this._y = y ?? x;
            this.markDirty();
        }
    }

    export const NOOP_TAG = 'noop';
    export const RAINBOW_COLORS = [
        0xFF0000,
        0xFF6600,
        0xFFFF00,
        0x00FF00,
        0x00D1FF,
        0x0000FF,
        0xDD00B2,
    ];
    export const TAGS: Dict<TagFunction> = {
        [NOOP_TAG]: (params) => {
            return {};
        },
        'w': (params) => {
            return { color: 0xFFFFFF };
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
        'pu': (params) => {
            return { color: 0x9900FF };
        },
        'gold': (params) => {
            return { color: 0xFFD800 };
        },
        'color': (params) => {
            return { color: getInt(params[0], undefined) };
        },
        'alpha': (params) => {
            return { alpha: getFloat(params[0], undefined) };
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
        'outline': (params) => {
            return { filters: [new Effects.Filters.Outline(getInt(params[0], 0x000000), getFloat(params[1], 1))] };
        },
        'wave': (params) => {
            let amp = getFloat(params[0], 1);
            let speed = getFloat(params[1], 1);
            return {
                offsetY: data => {
                    let t = data.t + data.position/8/speed;
                    return lerp(t, -amp, amp, Tween.Easing.OscillateSine(speed));
                },
            };
        },
        'rainbow': (params) => {
            let speed = getFloat(params[0], 0);
            return {
                color: data => {
                    let t = data.t * speed + data.position/7;
                    let colorI = Math.floor(t*7) % 7;
                    return RAINBOW_COLORS[colorI];
                },
            };
        },
    }

    function getInt<D extends number | undefined>(text: string, def: D): number | D {
        let result = parseInt(text);
        if (!isFinite(result)) return def;
        return result;
    }

    function getFloat<D extends number | undefined>(text: string, def: D): number | D {
        let result = parseFloat(text);
        if (!isFinite(result)) return def;
        return result;
    }
}