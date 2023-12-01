/// <reference path="../physicsWorldObject.ts" />

namespace Sprite {
    export type Config<WO extends Sprite> = PhysicsWorldObject.Config<WO> & {
        texture?: string | PIXI.Texture;
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
        tint?: number;
        alpha?: number;
        effects?: Effects.Config;
        blendMode?: PIXI.BLEND_MODES;
    }
}

class Sprite extends PhysicsWorldObject {
    private texture!: PIXI.Texture;
    private textureKey: string | undefined;

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

    tint: number;
    alpha: number;

    effects: Effects;
    blendMode?: PIXI.BLEND_MODES;

    private renderObject: PIXI.Sprite;

    constructor(config: Sprite.Config<Sprite> = {}) {
        super(config);

        if (config.texture || !this.texture) this.setTexture(config.texture);

        this.flipX = config.flipX ?? false;
        this.flipY = config.flipY ?? false;

        this.offsetX = config.offsetX ?? 0;
        this.offsetY = config.offsetY ?? 0;
        this.angle = config.angle ?? 0;
        this.angleOffset = config.angleOffset ?? 0;
        this.vangle = config.vangle ?? 0;
        this.scaleX = config.scaleX ?? (config.scale ?? 1);
        this.scaleY = config.scaleY ?? (config.scale ?? 1);

        this.tint = config.tint ?? 0xFFFFFF;
        this.alpha = config.alpha ?? 1;

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

    override compile(x: number, y: number): CompileResult {
        if (this.textureKey) {
            let texture = AssetCache.getPixiTexture(this.textureKey);
            if (texture) {
                this.renderObject.texture = texture;
                this.renderObject.anchor.x = texture.defaultAnchor.x;
                this.renderObject.anchor.y = texture.defaultAnchor.y;
            }
        }
        this.renderObject.x = x + this.offsetX;
        this.renderObject.y = y + this.offsetY;
        this.renderObject.scale.x = (this.flipX ? -1 : 1) * this.scaleX;
        this.renderObject.scale.y = (this.flipY ? -1 : 1) * this.scaleY;
        this.renderObject.angle = this.angle + this.angleOffset;
        this.renderObject.tint = this.tint;
        this.renderObject.alpha = this.alpha;
        this.renderObject.filters = this.effects.getFilterList();
        this.renderObject.blendMode = this.blendMode ?? PIXI.BLEND_MODES.NORMAL;

        diffCompile(this.renderObject, [super.compile(0, 0)]);
        
        return this.renderObject;
    }

    getTexture() {
        return this.texture;
    }

    getTextureKey() {
        return this.textureKey;
    }

    override getVisibleLocalBounds$(): Rectangle | undefined {
        if (!this.texture) return new Rectangle(0, 0, 0, 0);
        if (this.texture === Textures.EFFECT_ONLY) {
            return undefined;
        }
        // TODO PIXI optimize
        return Rectangle.fromPixiRectangle(this.compile(this.offsetX, this.offsetY)!.getLocalBounds());
    }

    setTexture(key: string | PIXI.Texture | undefined) {
        if (!key) {
            this.texture = Textures.NONE;
            this.textureKey = undefined;
            return;
        }

        this.textureKey = St.isString(key) ? key : undefined;
        this.texture = St.isString(key) ? AssetCache.getPixiTexture(key) : key;
    }
}
