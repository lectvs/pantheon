class Bullet extends Sprite {
    constructor(config: Sprite.Config = {}) {
        super({
            texture: 'bullet',
            bounds: new CircleBounds(0, 0, 4),
            ...config
        });
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);
        this.kill();
    }
}