/// <reference path="./sprite.ts" />

class Player extends Sprite {
    speed: number = 60;

    private direction: Direction2D;

    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'milo_sprites_0',
            bounds: { x: -5, y: -2, width: 10, height: 2 },
        });

        this.direction = Direction2D.LEFT;
    }

    update(delta: number, world: World) {
        let haxis = (Input.isDown('right') ? 1 : 0) - (Input.isDown('left') ? 1 : 0);
        let vaxis = (Input.isDown('down') ? 1 : 0) - (Input.isDown('up') ? 1 : 0);

        if (haxis < 0) {
            this.vx = -this.speed;
            this.direction.h = Direction.LEFT;
            if (vaxis == 0) this.direction.v = Direction.NONE;
            this.flipX = false;
        } else if (haxis > 0) {
            this.vx = this.speed;
            this.direction.h = Direction.RIGHT;
            if (vaxis == 0) this.direction.v = Direction.NONE;
            this.flipX = true;
        } else {
            this.vx = 0;
        }

        if (vaxis < 0) {
            this.vy = -this.speed;
            this.direction.v = Direction.UP;
            if (haxis == 0) this.direction.h = Direction.NONE;
        } else if (vaxis > 0) {
            this.vy = this.speed;
            this.direction.v = Direction.DOWN;
            if (haxis == 0) this.direction.h = Direction.NONE;
        } else {
            this.vy = 0;
        }

        super.update(delta, world);

        // Handle animation.
        let anim_state = (haxis == 0 && vaxis == 0) ? 'idle' : 'run';
        let anim_dir = this.direction.v == Direction.UP ? 'up' : (this.direction.h == Direction.NONE ? 'down' : 'side');

        this.playAnimation(`${anim_state}_${anim_dir}`);
    }
}