class Player extends Sprite {
    static MAX_SPEED: number = 32;

    constructor(config: Sprite.Config) {
        super({
            texture: 'player',
            ...config
        });

        this.behavior = new ControllerBehavior(function() {
            this.controller.left = Input.isDown('left');
            this.controller.right = Input.isDown('right');
            this.controller.up = Input.isDown('up');
            this.controller.down = Input.isDown('down');
        });
    }

    update() {
        let haxis = (this.controller.left ? -1 : 0) + (this.controller.right ? 1 : 0);
        let vaxis = (this.controller.up ? -1 : 0) + (this.controller.down ? 1 : 0);

        this.v.x = haxis * Player.MAX_SPEED;
        this.v.y = vaxis * Player.MAX_SPEED;

        super.update();
    }
}