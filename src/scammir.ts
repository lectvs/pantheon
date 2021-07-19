class Scammir extends Sprite {
    constructor(x: number, y: number) {
        super({
            name: 'scammir',
            x, y,
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'scammir', textures: [0, 1], frameRate: 2.5, count: Infinity }),
            ],
            defaultAnimation: 'idle',
            layer: 'main',
            physicsGroup: 'npcs',
            bounds: new RectBounds(-12, -4, 24, 24),
            gravityy: 400,
        });
    }
}