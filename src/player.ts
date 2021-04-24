namespace Player {
    export type GrappleData = {
        grapple: Grapple;
        grappleKey: string;
    }
}

class Player extends Sprite {

    private readonly SPEED = 64;
    private readonly JUMP_SPEED = 200;
    private readonly GRAVITY = 800;

    private grapple: Player.GrappleData;

    private get isGrappling() { return this.grapple; }

    constructor(config: Sprite.Config) {
        super({
            bounds: new RectBounds(-5, -10, 10, 10),
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'player', textures: [0, 1, 2, 3], frameRate: 12, count: -1 }),
                Animations.fromTextureList({ name: 'run',  texturePrefix: 'player', textures: [5, 6, 7, 8, 9], frameRate: 16, count: -1 }),
                Animations.fromTextureList({ name: 'jump',  texturePrefix: 'player', textures: [10], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'fall',  texturePrefix: 'player', textures: [11], frameRate: 8, count: -1 }),
            ],
            defaultAnimation: 'idle',
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
        // this.v.x = haxis * this.SPEED;

        // let grounded = this.isGrounded();

        // if (this.controller.jump && grounded) {
        //     this.v.y = -this.JUMP_SPEED;
        // }

        this.updateGrapple();

        super.update();

        if (haxis < 0) this.flipX = true;
        if (haxis > 0) this.flipX = false;

        // if (grounded) {
        //     this.playAnimation(haxis === 0 ? 'idle' : 'run');
        // } else {
        //     this.playAnimation(this.v.y < 0 ? 'jump' : 'fall');
        // }

        // if (this.controller.jump && grounded) {
        //     Puff.puff(this.world, this.x, this.y, 5, () => new PIXI.Point(Random.float(-50, 50), Random.float(-20, 0)));
        // }

        // if (this.controller.keys.justLeft) {
        //     Puff.puff(this.world, this.x, this.y, 5, () => {
        //         let v = Random.inCircle(15);
        //         v.x += 30;
        //         v.y += -15;
        //         return v;
        //     });
        // }

        // if (this.controller.keys.justRight) {
        //     Puff.puff(this.world, this.x, this.y, 5, () => {
        //         let v = Random.inCircle(15);
        //         v.x += -30;
        //         v.y += -15;
        //         return v;
        //     });
        // }
    }

    updateGrapple() {        
        if (this.isGrappling) {
            if (!this.controller.keys[this.grapple.grappleKey]) {
                this.grapple.grapple.removeFromWorld();
                this.grapple = undefined;
            }
        }

        let grappleKey: string = undefined;
        if (this.controller.left) grappleKey = 'left';
        if (this.controller.right) grappleKey = 'right';
        if (this.controller.up) grappleKey = 'up';
        if (this.controller.down) grappleKey = 'down';

        if (!this.isGrappling && grappleKey) {
            let direction = {
                'left': Direction2D.LEFT,
                'right': Direction2D.RIGHT,
                'up': Direction2D.UP,
                'down': Direction2D.DOWN
            }[grappleKey];

            this.grapple = {
                grapple: this.addChild(new Grapple(0, -8, direction)),
                grappleKey: grappleKey
            };
        }

        if (this.isGrappling) {
            if (this.grapple.grapple.isPulling) {
                this.v.x = this.grapple.grapple.direction.h * this.grapple.grapple.PULL_SPEED;
                this.v.y = this.grapple.grapple.direction.v * this.grapple.grapple.PULL_SPEED;
            } else {
                this.v.x = 0;
                this.v.y = 0;
            }
            this.gravity.y = 0;
        } else {
            this.gravity.y = this.GRAVITY;
        }
    }

    private isGrounded() {
        (<RectBounds>this.bounds).y++;
        let ground = this.world.select.overlap(this.bounds, ['walls']);
        (<RectBounds>this.bounds).y--;
        return !_.isEmpty(ground);
    }
}