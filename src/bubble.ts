class Bubble extends Sprite {
    private vvx: number;
    private vvy: number;

    constructor(x: number, y: number) {
        super({
            x: x, y: y,
            texture: 'bubble',
            layer: 'puffs',
            life: 1,
            vx: Random.float(-4, 4)
        });

        this.vvx = Random.float(-4, 4);
        this.vvy = Random.float(-40, -20);
    }

    update() {
        this.v.x = this.vvx * (1-this.life.progress);
        this.v.y = this.vvy * (1-this.life.progress);
        super.update();
    }
}