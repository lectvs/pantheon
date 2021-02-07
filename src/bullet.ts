class Bullet extends Sprite {
    static readonly MAX_SPEED = 200;

    constructor(config: Sprite.Config) {
        super({
            ...config
        });
    }

    update() {
        V.setMagnitude(this.v, Bullet.MAX_SPEED);
        super.update();
    }

    onCollide(other: PhysicsWorldObject) {
        super.onCollide(other);

        let decalModule = other.getModule(DecalModule);
        if (decalModule) {
            decalModule.drawSprite(this);
        }

        this.kill();
    }
}