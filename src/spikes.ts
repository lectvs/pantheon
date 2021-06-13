class Spikes extends Sprite {
    constructor(x: number, y: number, angle: number) {
        super({
            x: x, y: y,
            texture: 'spikes',
            angle: angle,
            layer: 'entities',
            physicsGroup: 'walls',
            bounds: new RectBounds(-7, -7, 14, 14),
            tags: ['deadly'],
        });
    }
}