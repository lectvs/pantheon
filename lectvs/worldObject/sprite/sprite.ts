/// <reference path="../physicsWorldObject.ts" />

namespace Sprite {
    export type Config = PhysicsWorldObject.Config & {
        texture?: string | Texture;
        animations?: Animation.Config[];
        defaultAnimation?: string;
        flipX?: boolean;
        flipY?: boolean;
        offset?: Pt;
        angle?: number;
        scaleX?: number;
        scaleY?: number;
        tint?: number;
        alpha?: number;
        effects?: Effects.Config;
    }
}

class Sprite extends PhysicsWorldObject {
    private texture: Texture;
    protected animationManager: AnimationManager;

    flipX: boolean;
    flipY: boolean;
    offset: Pt;
    angle: number;
    scaleX: number;
    scaleY: number;

    tint: number;
    alpha: number;

    effects: Effects;

    constructor(config: Sprite.Config, defaults?: Sprite.Config) {
        config = WorldObject.resolveConfig<Sprite.Config>(config, defaults);
        super(config);

        this.setTexture(config.texture);

        if (config.bounds === undefined) {
            // TODO: set this to texture's bounds (local)
            this.bounds = { x: 0, y: 0, width: 0, height: 0 };
        }

        this.animationManager = new AnimationManager(this);

        if (config.animations) {
            for (let animation of config.animations) {
                _.defaults(animation, {
                    frames: [],
                });
                this.animationManager.addAnimation(animation.name, animation.frames);
            }
        }

        if (config.defaultAnimation) {
            this.playAnimation(config.defaultAnimation, 0, true);
        }

        this.flipX = config.flipX ?? false;
        this.flipY = config.flipY ?? false;

        this.offset = config.offset || { x: 0, y: 0 };
        this.angle = config.angle ?? 0;
        this.scaleX = config.scaleX ??  1;
        this.scaleY = config.scaleY ??  1;

        this.tint = config.tint ?? 0xFFFFFF;
        this.alpha = config.alpha ?? 1;

        this.effects = new Effects();
        this.effects.updateFromConfig(config.effects);
    }

    update(delta: number) {
        super.update(delta);
        this.animationManager.update(delta);
        this.effects.updateEffects(delta);
    }

    render(screen: Texture) {
        this.texture.renderTo(screen, {
            x: this.renderScreenX + this.offset.x,
            y: this.renderScreenY + this.offset.y,
            scaleX: (this.flipX ? -1 : 1) * this.scaleX,
            scaleY: (this.flipY ? -1 : 1) * this.scaleY,
            angle: this.angle,
            tint: this.tint,
            alpha: this.alpha,
            filters: this.effects.getFilterList(),
        });
        
        super.render(screen);
    }

    getCurrentAnimationName() {
        return this.animationManager.getCurrentAnimationName();
    }

    getTexture() {
        return this.texture;
    }

    playAnimation(name: string, startFrame: number = 0, force: boolean = false) {
        this.animationManager.playAnimation(name, startFrame, force);
    }

    setTexture(key: string | Texture) {
        if (!key) {
            this.texture = Texture.none();
            return;
        }
        if (_.isString(key)) key = AssetCache.getTexture(key);
        this.texture = key;
    }
}
