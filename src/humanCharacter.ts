/// <reference path="./sprite.ts" />

class HumanCharacter extends Sprite {
    speed: number = 60;

    private direction: Direction2D;
    private _follow: Follow;

    constructor(config: Sprite.Config) {
        super(config);

        this.controllerSchema = {
            left: () => Input.isDown('left'),
            right: () => Input.isDown('right'),
            up: () => Input.isDown('up'),
            down: () => Input.isDown('down'),
        };

        this.direction = Direction2D.LEFT;
    }

    update() {
        this.updateFollow();

        let haxis = (this.controller.right ? 1 : 0) - (this.controller.left ? 1 : 0);
        let vaxis = (this.controller.down ? 1 : 0) - (this.controller.up ? 1 : 0);

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

        super.update();

        // Handle animation.
        let anim_state = (haxis == 0 && vaxis == 0) ? 'idle' : 'run';
        let anim_dir = this.direction.v == Direction.UP ? 'up' : (this.direction.h == Direction.NONE ? 'down' : 'side');

        this.playAnimation(`${anim_state}_${anim_dir}`);
    }

    follow(thing: Follow.Target, maxDistance: number = 16) {
        this._follow = new Follow(thing, maxDistance);
    }

    onCollide(other: PhysicsWorldObject) {
        if (other instanceof Warp) {
            other.warp();
        }
    }

    updateFollow() {
        if (this._follow) this._follow.update(this);
    }
}