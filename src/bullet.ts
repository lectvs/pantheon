class Bullet extends Sprite {
    static readonly MAX_SPEED = 64;

    constructor(config: Sprite.Config) {
        super({
            ...config
        });
    }

    update() {
        V.setMagnitude(this.v, Bullet.MAX_SPEED);
        super.update();
    }
}