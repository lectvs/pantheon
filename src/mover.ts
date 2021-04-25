class Mover extends Sprite {
    constructor(tx: number, ty: number, angle: number) {
        super({
            x: tx*16 + 8,
            y: ty*16 + 8,
            texture: 'mover',
            layer: 'entities',
            physicsGroup: 'movers',
            bounds: new RectBounds(-6, -6, 12, 12),
            v: V.rotated({ x: 0, y: 32 }, M.degToRad(angle)),
            bounce: 1,
        });
    }
}