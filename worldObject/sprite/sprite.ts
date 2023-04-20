/// <reference path="../physicsWorldObject.ts" />

namespace Sprite {
    export type Config = ReplaceConfigCallbacks<PhysicsWorldObject.Config, Sprite> & {
        texture?: string | Texture;
        animations?: Animation.Config[];
        defaultAnimation?: string;
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
        mask?: TextureFilters.Mask.WorldObjectMaskConfig;
        blendMode?: Texture.BlendMode;
    }
}

class Sprite extends PhysicsWorldObject {
    private texture: Texture;
    private textureKey: string;
    protected animationManager: AnimationManager;

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
    mask: TextureFilters.Mask.WorldObjectMaskConfig;
    blendMode: Texture.BlendMode;

    onScreenPadding: number;

    constructor(config: Sprite.Config = {}) {
        super(config);

        this.setTexture(config.texture);

        this.animationManager = new AnimationManager(this);
        for (let animation of config.animations || []) {
            this.addAnimation(animation);
        }
        if (config.defaultAnimation) {
            this.playAnimation(config.defaultAnimation);
        } else if (!_.isEmpty(config.animations)) {
            this.playAnimation(config.animations[0].name);
        }

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

        this.onScreenPadding = 1;
    }

    update() {
        super.update();
        this.animationManager.update(this.delta);
        this.effects.updateEffects(this.delta);

        this.angle += this.vangle * this.delta;
    }

    render(texture: Texture, x: number, y: number) {
        this.texture.renderTo(texture, {
            x: x + this.offsetX,
            y: y + this.offsetY,
            scaleX: (this.flipX ? -1 : 1) * this.scaleX,
            scaleY: (this.flipY ? -1 : 1) * this.scaleY,
            angle: this.angle + this.angleOffset,
            tint: this.tint,
            alpha: this.alpha,
            filters: this.effects.getFilterList(),
            mask: TextureFilters.Mask.getTextureMaskForWorldObject(this.mask, this, x, y),
            blendMode: this.blendMode,
        });
        super.render(texture, x, y);
    }

    addAnimation(animation: Animation.Config) {
        this.animationManager.addAnimation(animation.name, animation.frames);
    }

    getCurrentAnimationName() {
        return this.animationManager.getCurrentAnimationName();
    }

    getTexture() {
        return this.texture;
    }

    getTextureKey() {
        return this.textureKey;
    }

    getTextureWorldBounds() {
        let bounds = this.getTextureLocalBounds();
        bounds.x += this.x + this.offsetX;
        bounds.y += this.y + this.offsetY;
        return bounds;
    }

    getVisibleScreenBounds() {
        if (this.texture === Texture.EFFECT_ONLY) {
            return undefined;
        }
        let bounds = this.getTextureLocalBounds();
        bounds.x += this.getRenderScreenX() + this.offsetX - this.onScreenPadding;
        bounds.y += this.getRenderScreenY() + this.offsetY - this.onScreenPadding;
        bounds.width += 2*this.onScreenPadding;
        bounds.height += 2*this.onScreenPadding;
        return bounds;
    }

    hasAnimation(name: string) {
        return this.animationManager.hasAnimation(name);
    }

    playAnimation(name: string, force: boolean = false) {
        this.animationManager.playAnimation(name, force);
    }

    setTexture(key: string | Texture) {
        if (!key) {
            this.texture = Texture.NONE;
            this.textureKey = undefined;
            return;
        }

        this.textureKey = _.isString(key) ? key : undefined;
        this.texture = _.isString(key) ? AssetCache.getTexture(key) : key;
    }

    private getTextureLocalBounds() {
        if (!this.texture) return rect(0, 0, 0, 0);
        return this.texture.getLocalBounds({
            angle: this.angle + this.angleOffset,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
        });
    }
}
