class Bullet extends Sprite {
    constructor() {
        super();

        this.setTexture('bullet');
        this.bounds = new CircleBounds(0, 0, 4);
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);
        this.kill();
    }
}