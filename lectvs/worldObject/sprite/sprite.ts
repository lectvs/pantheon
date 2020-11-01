/// <reference path="../physicsWorldObject.ts" />

class Sprite extends PhysicsWorldObject {
    private texture: Texture;
    protected animationManager: AnimationManager;

    flipX: boolean;
    flipY: boolean;
    offset: Pt;
    angle: number;
    vangle: number;
    scaleX: number;
    scaleY: number;

    tint: number;
    alpha: number;

    effects: Effects;
    mask: Mask.WorldObjectMaskConfig;

    onScreenPadding: number;

    constructor(texture?: string | Texture) {
        super();

        this.setTexture(texture);

        this.animationManager = new AnimationManager(this);

        this.flipX = false;
        this.flipY = false;

        this.offset = { x: 0, y: 0 };
        this.angle = 0;
        this.vangle = 0;
        this.scaleX = 1;
        this.scaleY = 1;

        this.tint = 0xFFFFFF;
        this.alpha = 1;

        this.effects = new Effects();

        this.onScreenPadding = 1;
    }

    update() {
        super.update();
        this.animationManager.update(this.delta);
        this.effects.updateEffects(this.delta);


        this.angle += this.vangle * this.delta;
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
            mask: Mask.getTextureMaskForWorldObject(this.mask, this),
        });
        
        super.render(screen);
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

    getVisibleScreenBounds() {
        let bounds = this.getTextureLocalBounds();
        bounds.x += this.renderScreenX - this.onScreenPadding;
        bounds.y += this.renderScreenY - this.onScreenPadding;
        bounds.width += 2*this.onScreenPadding;
        bounds.height += 2*this.onScreenPadding;
        return bounds;
    }

    playAnimation(name: string, startFrame: number = 0, force: boolean = false) {
        this.animationManager.playAnimation(name, startFrame, force);
    }

    setTexture(key: string | Texture) {
        if (!key) {
            this.texture = Texture.NONE;
            return;
        }
        if (_.isString(key)) key = AssetCache.getTexture(key);
        this.texture = key;
    }

    private getTextureLocalBounds() {
        if (!this.texture) return rect(0, 0, 0, 0);
        return this.texture.getLocalBounds({
            angle: this.angle,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
        });
    }
}
