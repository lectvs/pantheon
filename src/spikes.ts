class Spikes extends Sprite {
    constructor(tx: number, ty: number, angle: number) {
        super({
            x: tx*16 + 8,
            y: ty*16 + 8,
            texture: 'spikes',
            angle: angle,
            layer: 'entities',
            physicsGroup: 'walls',
            bounds: new RectBounds(-7, -7, 14, 14),
        });
    }
}