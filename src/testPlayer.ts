class TestPlayer extends Sprite {
    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'generic_sprites_0',
            bounds: { x: -5, y: -2, width: 10, height: 2 },
        });
    }

    update(delta: number) {
        let speed = 100;
        this.vx = ((Input.isDown('left') ? -1 : 0) + (Input.isDown('right') ? 1 : 0)) * speed;
        this.vy = ((Input.isDown('up') ? -1 : 0) + (Input.isDown('down') ? 1 : 0)) * speed;
        super.update(delta);
    }
}