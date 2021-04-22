/// <reference path="../lectvs/worldObject/module.ts" />

class DecalModule extends Module<WorldObject> {

    decal: Sprite;

    private mask: Mask.WorldObjectMaskConfig;

    constructor(mask?: Mask.WorldObjectMaskConfig) {
        super(WorldObject);
        this.mask = mask;
    }

    init(worldObject: WorldObject) {
        super.init(worldObject);
        if (this.worldObject instanceof PhysicsWorldObject && this.worldObject.parent instanceof Tilemap) {
            let box = this.worldObject.bounds.getBoundingBox();
            let texture = new AnchoredTexture(box.width, 18);
            texture.anchorX = 0;
            texture.anchorY = 1;

            this.decal = this.worldObject.addChildKeepWorldPosition(new Sprite({
                x: box.left,
                y: box.bottom,
                texture: texture,
                mask: this.mask,
                layer: 'main',
            }));
        } else if (this.worldObject instanceof Sprite) {
            let texture = this.worldObject.getTexture().clone();
            texture.clear();

            this.decal = this.worldObject.addChild(new Sprite({
                x: 0, y: 0,
                texture: texture,
                mask: this.mask,
                matchParentLayer: true,
            }));
        }
    }

    drawSprite(sprite: Sprite) {
        let dtwb = this.decal.getTextureWorldBounds();
        sprite.render(this.decal.getTexture(), sprite.x - dtwb.x, sprite.y - sprite.z - dtwb.y);
    }
}