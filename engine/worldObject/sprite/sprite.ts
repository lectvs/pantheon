/// <reference path="../physicsWorldObject.ts" />

namespace Sprite {
    export type Config<WO extends Sprite> = PhysicsWorldObject.Config<WO> & {
        texture?: string | PIXI.Texture;
        textureAnchor?: Pt;
        textureTint?: number;
        textureAlpha?: number;
        flipX?: boolean;
        flipY?: boolean;
        offsetX?: number;
        offsetY?: number;
        angle?: number;
        angleOffset?: number;
        vangle?: number;
        scale?: number;
        scaleX?: number;
        scaleY?: number;
        skewX?: number;
        skewY?: number;
        effects?: Effects.Config;
        blendMode?: PIXI.BLEND_MODES;
    }
}

class Sprite extends PhysicsWorldObject {
    private texture!: PIXI.Texture;
    private textureKey: string | undefined;

    textureAnchor?: Vector2;
    textureTint: number;
    textureAlpha: number;
    flipX: boolean;
    flipY: boolean;
    offsetX: number;
    offsetY: number;
    angle: number;
    angleOffset: number;
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

    skewX: number;
    skewY: number;

    effects: Effects;
    blendMode?: PIXI.BLEND_MODES;

    private renderObject: PIXI.Sprite;

    constructor(config: Sprite.Config<Sprite> = {}) {
        super(config);

        if (config.texture || !this.texture) this.setTexture(config.texture);

        if (config.textureAnchor) this.textureAnchor = vec2(config.textureAnchor);
        this.textureTint = config.textureTint ?? 0xFFFFFF;
        this.textureAlpha = config.textureAlpha ?? 1;
        this.flipX = config.flipX ?? false;
        this.flipY = config.flipY ?? false;

        this.offsetX = config.offsetX ?? 0;
        this.offsetY = config.offsetY ?? 0;
        this.angle = config.angle ?? 0;
        this.angleOffset = config.angleOffset ?? 0;
        this.vangle = config.vangle ?? 0;
        this.scaleX = config.scaleX ?? (config.scale ?? 1);
        this.scaleY = config.scaleY ?? (config.scale ?? 1);
        this.skewX = config.skewX ?? 0;
        this.skewY = config.skewY ?? 0;

        this.effects = new Effects();
        this.effects.updateFromConfig(config.effects);

        this.blendMode = config.blendMode;

        this.renderObject = new PIXI.Sprite();
    }

    override update() {
        super.update();
        this.effects.updateEffects(this.delta);

        this.angle += this.vangle * this.delta;
    }

    override render(): [PIXI.Sprite, ...Render.Result] {
        this.ensureGCCTextureLoaded();
        this.renderObject.texture = this.texture;
        this.renderObject.anchor.x = this.textureAnchor ? this.textureAnchor.x : this.texture.defaultAnchor.x;
        this.renderObject.anchor.y = this.textureAnchor ? this.textureAnchor.y : this.texture.defaultAnchor.y;
        this.renderObject.x = this.offsetX;
        this.renderObject.y = this.offsetY;
        this.renderObject.scale.x = (this.flipX ? -1 : 1) * this.scaleX;
        this.renderObject.scale.y = (this.flipY ? -1 : 1) * this.scaleY;
        this.renderObject.skew.x = this.skewX;
        this.renderObject.skew.y = this.skewY;
        this.renderObject.angle = this.angle + this.angleOffset;
        this.renderObject.tint = Color.combineTints(this.getTotalTint(), this.textureTint);
        this.renderObject.alpha = this.getTotalAlpha() * this.textureAlpha;
        this.renderObject.blendMode = this.blendMode ?? PIXI.BLEND_MODES.NORMAL;
        this.renderObject.updateAndSetEffects(this.effects);
        O.putMetadata(this.renderObject, 'renderedFrom', this);

        let result: [PIXI.Sprite, ...Render.Result] = FrameCache.array(this.renderObject);
        result.pushAll(super.render());

        return result;
    }

    getTexture() {
        return this.texture;
    }

    getTextureKey() {
        return this.textureKey;
    }

    override getVisibleLocalBounds$(): Rectangle | undefined {
        if (this.texture === Textures.NOOP) {
            return undefined;
        }
        
        this.ensureGCCTextureLoaded();

        return TextureUtils.getTextureLocalBounds$(this.texture,
            this.offsetX,
            this.offsetY,
            this.scaleX,
            this.scaleY,
            this.angle,
            this.textureAnchor,
        );
    }

    setTexture(key: string | PIXI.Texture | undefined) {
        let oldTexture = this.texture;
        if (GCCTextures.isGCCTexture(oldTexture)) {
            GCCTextures.unregisterWorldObjectTexture(oldTexture, this);
        }

        if (!key) {
            this.texture = Textures.NONE;
            this.textureKey = undefined;
            return;
        }

        let textureKey = St.isString(key) ? key : undefined;
        let texture = St.isString(key) ? AssetCache.getTexture(key) : key;

        if (!texture) {
            console.error('Tried to set undefined texture!', this);
            return;
        }

        this.textureKey = textureKey;
        this.texture = texture;

        if (GCCTextures.isGCCTexture(texture)) {
            GCCTextures.registerWorldObjectTexture(texture, this);
        }
    }

    private ensureGCCTextureLoaded() {
        if (GCCTextures.isGCCTextureDestroyed(this.texture)) {
            console.log('recreating')
            this.setTexture(GCCTextures.getNewGCCTexture(this.texture));
        }
    }
}
