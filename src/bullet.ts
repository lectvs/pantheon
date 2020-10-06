class Bullet extends Sprite {
    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'bullet',
            bounds: { type: 'circle', x: 0, y: 0, radius: 4 },
        });
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);
        this.kill();
    }
}