class Orb extends Sprite {
    private twitchTimer: Timer;

    shaking = false;

    constructor(x: number, y: number, name: string, scale: number, layer: string) {
        super({
            name: name,
            x, y,
            texture: 'orb',
            layer: layer,
            scaleX: scale,
            scaleY: scale,
        });

        this.twitchTimer = new Timer(0.2, () => this.angle = Random.int(0, 3) * 90, true);
    }

    update() {
        super.update();
        this.twitchTimer.update(this.delta);
        if (this.shaking) {
            this.offsetX = Random.int(-5, 5) * (1 - this.scaleX);
            this.offsetY = Random.int(-5, 5) * (1 - this.scaleY);
        }
    }
}