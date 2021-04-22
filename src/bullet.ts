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

        if (Input.justDown('rmb')) this.kill();

        let r = 1;
        if (Random.boolean(r*this.delta)) {
            this.spawnPaintDrop(Random.inCircle(20), 0);
        }
    }

    kill() {
        // Paint on wall
        for (let i = 0; i < 5; i++) {
            this.spawnPaintDrop(pt(Random.float(-20, 20), -10), Random.float(2, 14));
        }
        // Paint in front of wall
        for (let i = 0; i < 5; i++) {
            this.spawnPaintDrop(pt(Random.float(-20, 20), 10*Random.float(0, 1)**2 + 1), Random.float(4, 16))
        }
        super.kill();
    }

    onCollide(collision: Physics.CollisionInfo) {
        super.onCollide(collision);
        this.kill();
    }

    private spawnPaintDrop(v: Pt, height: number) {
        this.world.addWorldObject(new PaintDrop({
            x: this.x, y: this.y, z: this.z,
            v: v,
            vz: M.jumpVelocityForHeight(height, PaintDrop.GRAVITY),
            tint: this.tint,
            layer: 'main',
            physicsGroup: 'paintdrops',
        }));
    }
}