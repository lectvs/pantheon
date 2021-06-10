class Mover extends Sprite {
    constructor(tx: number, ty: number, angle: number) {
        super({
            x: tx*16 + 8,
            y: ty*16 + 8,
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