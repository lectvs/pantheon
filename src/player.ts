class Player extends Sprite {
    private readonly speed: number = 128;
    private readonly jumpForce: number = 256;

    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'player',
            tint: 0xFF0000,
            bounds: { x: -16, y: -64, width: 32, height: 64 },
            gravityy: 512,
        });

        this.controllerSchema = {
            left: () => Input.isDown('left'),
            right: () => Input.isDown('right'),
            jump: () => Input.justDown('up'),
        };

        this.addChild(<Sprite.Config>{
            constructor: Sprite,
            texture: 'debug',
            x: 0, y: 0,
        });
    }

    update(delta: number) {
        let haxis = (this.controller.right ? 1 : 0) - (this.controller.left ? 1 : 0);
        this.updateMovement(haxis);
        super.update(delta);
    }

    private updateMovement(haxis: number) {
        this.vx = haxis * this.speed;

        if (this.controller.jump) {
            this.vy = -this.jumpForce;
        }
    }
}