class Leaf extends Sprite {

    private readonly zGravity = 16;
    private vz: number;

    constructor(config: Sprite.Config) {
        super(config);
        this.vz = Random.float(0, 16);
        this.life.time = Random.float(0, 6.28);
    }

    update(delta: number) {
        super.update(delta);

        this.vx = 32*Math.sin(4*this.life.time);
        this.vz += this.zGravity * delta;
        this.offset.y += this.vz * delta;
        if (this.offset.y >= 0) {
            this.drawOnGround();
            this.kill();
        }

        this.flipX = this.vx > 0;
    }

    drawOnGround() {
        let groundTexture = this.world.getWorldObjectByName<Sprite>('ground').getTexture();
        groundTexture.render(this.getTexture(), {
            x: this.x,
            y: this.y,
            scaleX: this.flipX ? -1 : 1,
        });
    }
}