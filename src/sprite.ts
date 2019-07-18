/// <reference path="./physicsWorldObject.ts" />

namespace Sprite {
    export type Config = PhysicsWorldObject.Config & {
        texture?: string;
        graphics?: PIXI.Graphics;
        renderTexture?: PIXIRenderTextureSprite | { width: number, height: number };
        offset?: Pt;
        angle?: number;
        animations?: Animation.Config[];
        tint?: number;
        alpha?: number;
    }
}

class Sprite extends PhysicsWorldObject {
    private displayObject: PIXI.Sprite | PIXI.Graphics | PIXIRenderTextureSprite;
    spriteType: Sprite.Type;

    protected animationManager: AnimationManager;

    flipX: boolean;
    flipY: boolean;
    offset: Pt;
    angle: number;

    tint: number;
    alpha: number;

    constructor(config: Sprite.Config, defaults: Sprite.Config = {}) {
        config = O.withDefaults(config, defaults);
        super(config);

        if (config.texture) {
            this.setTexture(config.texture);
        } else if (config.graphics) {
            this.setGraphics(config.graphics);
        } else if (config.renderTexture) {
            if (config.renderTexture instanceof PIXIRenderTextureSprite) {
                this.setRenderTexture(config.renderTexture);
            } else {
                this.setRenderTextureDimensions(config.renderTexture.width, config.renderTexture.height);
            }
        } else {
            debug("SpriteConfig must have texture, graphics, or renderTexture specified:", config);
            this.setGraphics(new PIXI.Graphics());  // Continue gracefully
        }

        if (config.bounds === undefined) {
            this.bounds = this.getDisplayObjectLocalBounds();
        }

        this.animationManager = new AnimationManager(this);

        if (config.animations) {
            for (let animation of config.animations) {
                this.animationManager.addAnimation(animation.name, animation.frames);
            }
        }

        this.flipX = false;
        this.flipY = false;

        this.offset = config.offset || { x: 0, y: 0 };
        this.angle = O.getOrDefault(config.angle, 0);

        this.tint = O.getOrDefault(config.tint, 0xFFFFFF);
        this.alpha = O.getOrDefault(config.alpha, 1);
    }

    update(options: UpdateOptions) {
        super.update(options);
        this.animationManager.update(options.delta);
    }

    render(options: RenderOptions) {
        this.setDisplayObjectProperties();

        options.renderer.render(this.displayObject, options.renderTexture, false, options.matrix);
        super.render(options);
    }

    getCurrentAnimationName() {
        return this.animationManager.getCurrentAnimationName();
    }

    getDisplayObjectLocalBounds() {
        return this.displayObject.getLocalBounds();
    }

    getDisplayObjectWorldBounds() {
        let local = this.getDisplayObjectLocalBounds();
        return new Rectangle(local.x + this.displayObject.x, local.y + this.displayObject.y, local.width, local.height);
    }

    playAnimation(name: string, startFrame: number = 0, force: boolean = false) {
        this.animationManager.playAnimation(name, startFrame, force);
    }

    setDisplayObjectProperties() {
        this.displayObject.x = this.x + this.offset.x;
        this.displayObject.y = this.y + this.offset.y;
        this.displayObject.scale.x = this.flipX ? -1 : 1;
        this.displayObject.scale.y = this.flipY ? -1 : 1;
        this.displayObject.angle = this.angle;
        this.displayObject.tint = this.tint;
        this.displayObject.alpha = this.alpha;
    }

    setGraphics(graphics: PIXI.Graphics) {
        this.displayObject = graphics;
        this.spriteType = Sprite.Type.GRAPHICS;
    }

    setRenderTexture(renderTexture: PIXIRenderTextureSprite) {
        this.displayObject = renderTexture;
        this.spriteType = Sprite.Type.RENDERTEXTURE;
    }

    setRenderTextureDimensions(width: number, height: number) {
        if (this.spriteType === Sprite.Type.RENDERTEXTURE) {
            let renderTexture = <PIXIRenderTextureSprite>this.displayObject;
            if (renderTexture.width !== width || renderTexture.height !== height) {
                renderTexture.resize(width, height);
            }
        } else {
            this.displayObject = new PIXIRenderTextureSprite(width, height);
            this.spriteType = Sprite.Type.RENDERTEXTURE;
        }
    }

    setTexture(key: string) {
        if (this.spriteType === Sprite.Type.SPRITE) {
            let sprite = <PIXI.Sprite>this.displayObject;
            let texture = AssetCache.getTexture(key);
            if (sprite.texture !== texture) {
                sprite.texture = texture;
            }
        } else {
            this.displayObject = new PIXI.Sprite(AssetCache.getTexture(key));
            this.spriteType = Sprite.Type.SPRITE;
        }
    }
}

namespace Sprite {
    export enum Type {
        SPRITE, GRAPHICS, RENDERTEXTURE,
    }
}
