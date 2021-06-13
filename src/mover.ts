class Mover extends Sprite {
    constructor(x: number, y: number, angle: number) {
        super({
            x: x, y: y,
            texture: 'mover',
            layer: 'entities',
            physicsGroup: 'movers',
            bounds: new RectBounds(-6, -6, 12, 12),
            v: new Vector2(0, 32).rotated(angle),
            bounce: 1,
            tags: ['deadly'],
        });
    }
}