/// <reference path="../../worldObject/sprite/sprite.ts" />

/**
 * WorldObject that visualizes some rect/bounds.
 */
class VisualizeBounds extends Sprite {

    constructor(private getBounds: () => Rect | Bndries) {
        super({
            texture: Textures.filledRect(1, 1, 0xFFFFFF),
        });
    }

    override postUpdate(): void {
        super.postUpdate();

        let bounds = this.getBounds();
        let rectangle = 'x' in bounds ? bounds : Rectangle.fromBoundaries(bounds);

        this.x = rectangle.x;
        this.y = rectangle.y;
        this.scaleX = rectangle.width;
        this.scaleY = rectangle.height;
    }
}