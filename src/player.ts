class Player extends Sprite {
    static readonly MAX_SPEED = 64;

    constructor(config: Sprite.Config) {
        super({
            texture: 'player',
            ...config
        });

        let player = this;
        this.behavior = new ControllerBehavior(function() {
            this.controller.left = Input.isDown('left');
            this.controller.right = Input.isDown('right');
            this.controller.up = Input.isDown('up');
            this.controller.down = Input.isDown('down');
            this.controller.attack = Input.justDown('lmb');
            this.controller.aimDirection.x = player.world.getWorldMouseX() - player.x;
            this.controller.aimDirection.y = player.world.getWorldMouseY() - (player.y-4);
        });
    }

    update() {
        let haxis = (this.controller.left ? -1 : 0) + (this.controller.right ? 1 : 0);
        let vaxis = (this.controller.up ? -1 : 0) + (this.controller.down ? 1 : 0);

        this.v.x = haxis * Player.MAX_SPEED;
        this.v.y = vaxis * Player.MAX_SPEED;

        super.update();

        if (this.controller.attack) {
            this.attack();
        }

        if (haxis < 0) this.flipX = true;
        if (haxis > 0) this.flipX = false;
    }

    attack() {
        this.world.addWorldObject(new Bullet({
            x: this.x, y: this.y-4,
            texture: AnchoredTexture.fromBaseTexture(Texture.filledCircle(4, 0xFF0000, 1), 0.5, 0.5),
            v: this.controller.aimDirection,
            layer: 'main',
            physicsGroup: 'bullets',
            bounds: new CircleBounds(0, 0, 4),
        }));
    }
}