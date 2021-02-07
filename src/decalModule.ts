/// <reference path="../lectvs/worldObject/module.ts" />

class DecalModule extends Module<PhysicsWorldObject> {

    decal: Sprite;

    init() {
        if (this.worldObject.parent instanceof Tilemap) {
            let box = this.worldObject.bounds.getBoundingBox();
            let texture = new AnchoredTexture(box.width, 16);
            texture.anchorX = 0;
            texture.anchorY = 1;

            this.decal = this.worldObject.addChildKeepWorldPosition(new Sprite({
                x: box.left,
                y: box.bottom,
                texture: texture,
                layer: 'main',
            }));
        }
    }

    drawSprite(sprite: Sprite) {
        let dtwb = this.decal.getTextureWorldBounds();
        debug(sprite.x - dtwb.x, sprite.y - dtwb.y)
        sprite.render(this.decal.getTexture(), sprite.x - dtwb.x, sprite.y - sprite.z - dtwb.y);
    }
}