/// <reference path="./physicsWorldObject.ts" />

namespace Sprite {
    export type Config = PhysicsWorldObject.Config & {
        texture?: string | Texture;
        offset?: Pt;
        angle?: number;
        animations?: Animation.Config[];
        defaultAnimation?: string;
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

    tint: number;
    alpha: number;

    effects: Effects;

    constructor(config: Sprite.Config, defaults: Sprite.Config = {}) {
        config = O.withDefaults(config, defaults);
        super(config);

        this.setTexture(config.texture);

        if (config.bounds === undefined) {
            this.bounds = { x: 0, y: 0, width: 0, height: 0 };//this.getTextureLocalBounds();
        }

        this.animationManager = new AnimationManager(this);

        if (config.animations) {
            for (let animation of config.animations) {
                _.defaults(animation, {
                    duration: 0,
                });
                this.animationManager.addAnimation(animation.name, animation.frames);
            }
        }

        if (config.defaultAnimation) {
            this.playAnimation(config.defaultAnimation, 0, true);
        }

        this.flipX = false;
        this.flipY = false;

        this.offset = config.offset || { x: 0, y: 0 };
        this.angle = O.getOrDefault(config.angle, 0);

        this.tint = O.getOrDefault(config.tint, 0xFFFFFF);
        this.alpha = O.getOrDefault(config.alpha, 1);

        this.effects = new Effects();
    }

    update() {
        super.update();
        this.animationManager.update();

        if (global.world.getName(this) === 'angie' && Input.justDown('1')) {
            this.effects.outline.enabled = !this.effects.outline.enabled;
            this.effects.outline.color = 0xFF00FF;
        }
    }

    render() {
        global.screen.render(this.texture, {
            x: this.x + this.offset.x,
            y: this.y + this.offset.y,
            scaleX: this.flipX ? -1 : 1,
            scaleY: this.flipY ? -1 : 1,
            angle: this.angle,
            tint: this.tint,
            alpha: this.alpha,
            filters: this.effects.getFilterList(),
        });
        
        super.render();
    }

    getCurrentAnimationName() {
        return this.animationManager.getCurrentAnimationName();
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

