class Leaf extends Sprite {

    constructor(config: Sprite.Config) {
        super(config);
        this.vz = Random.float(0, -16);
        this.gravityz = -16;
        this.life.time = Random.float(0, 6.28);
    }

    update(delta: number) {
        super.update(delta);

        this.vx = 32*Math.sin(4*this.life.time);
        this.flipX = this.vx > 0;

        if (this.z <= 0) {
            this.drawOnGround();
            this.kill();
        }
    }

    drawOnGround() {
        if (this.world.hasWorldObject('ground')) {
            let groundTexture = this.world.getWorldObjectByName<Sprite>('ground').getTexture();
            this.render(groundTexture);
        }
    }
}