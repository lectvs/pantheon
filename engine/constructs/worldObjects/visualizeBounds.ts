/// <reference path="../../worldObject/sprite/sprite.ts" />

/**
 * WorldObject that visualizes some rect/bounds.
 */
class VisualizeBounds extends Sprite {

    constructor(private getBounds: () => Rect | Bndries | undefined) {
        super({
            texture: Textures.filledRect(1, 1, 0x00FF00),
        });
    }

    override postUpdate(): void {
        super.postUpdate();

        let bounds = this.getBounds();
        if (!bounds) {
            this.x = NaN;
            this.y = NaN;
            return;
        }

        let rectangle = 'x' in bounds ? bounds : Rectangle.fromBoundaries(bounds);

        this.x = rectangle.x;
        this.y = rectangle.y;
        this.scaleX = rectangle.width;
        this.scaleY = rectangle.height;
    }
}