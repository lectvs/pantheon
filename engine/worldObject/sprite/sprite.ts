/// <reference path="../physicsWorldObject.ts" />

namespace Sprite {
    export type Config<WO extends Sprite> = PhysicsWorldObject.Config<WO> & {
        texture?: string | Texture;
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
        mask?: Mask.WorldObjectMaskConfig;
        blendMode?: Texture.BlendMode;
    }
}

class Sprite extends PhysicsWorldObject {
    private texture!: Texture;
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
    mask?: Mask.WorldObjectMaskConfig;
    blendMode?: Texture.BlendMode;

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

        this.mask = config.mask;
        this.blendMode = config.blendMode;
    }

    override update() {
        super.update();
        this.effects.updateEffects(this.delta);

        this.angle += this.vangle * this.delta;
    }

    override render(texture: Texture, x: number, y: number) {
        this.texture.renderTo(texture, {
            x: x + this.offsetX,
            y: y + this.offsetY,
            scaleX: (this.flipX ? -1 : 1) * this.scaleX,
            scaleY: (this.flipY ? -1 : 1) * this.scaleY,
            angle: this.angle + this.angleOffset,
            tint: this.tint,
            alpha: this.alpha,
            filters: this.effects.getFilterList(),
            mask: Mask.getTextureMaskForWorldObject(this.mask, this, x, y),
            blendMode: this.blendMode,
        });
        super.render(texture, x, y);
    }

    getTexture() {
        return this.texture;
    }

    getTextureKey() {
        return this.textureKey;
    }

    override getVisibleLocalBounds(): Rect | undefined {
        if (!this.texture) return rect(0, 0, 0, 0);
        if (this.texture === Texture.EFFECT_ONLY) {
            return undefined;
        }
        return this.texture.getLocalBounds({
            x: this.offsetX,
            y: this.offsetY,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            angle: this.angle + this.angleOffset,
        });
    }

    setTexture(key: string | Texture | undefined) {
        if (!key) {
            this.texture = Texture.NONE;
            this.textureKey = undefined;
            return;
        }

        this.textureKey = St.isString(key) ? key : undefined;
        this.texture = St.isString(key) ? AssetCache.getTexture(key) : key;
    }
}
