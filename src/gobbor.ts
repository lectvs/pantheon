class Gobbor extends Sprite {
    constructor(x: number, y: number) {
        super({
            name: 'gobbor',
            x, y,
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'gobbor', textures: [0, 1], frameRate: 3, count: Infinity }),
            ],
            defaultAnimation: 'idle',
            layer: 'main',
            physicsGroup: 'npcs',
            bounds: new RectBounds(-12, -4, 24, 24),
            gravityy: 400,
        });
    }
}