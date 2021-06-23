class Player extends Sprite {

    private readonly RUN_SPEED = 64;
    private readonly JUMP_SPEED = 200;
    private readonly AIR_FRICTION = 100;
    private readonly GROUND_FRICTION = 1000;

    constructor(x: number, y: number) {
        super({
            x: x, y: y,
            layer: 'main',
            physicsGroup: 'player',
            gravityy: 400,
            bounds: new RectBounds(-4, -12, 8, 12),
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'player', textures: [0, 1, 2, 3], frameRate: 12, count: -1 }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'player', textures: [5, 6, 7, 8, 9], frameRate: 16, count: -1 }),
                Animations.fromTextureList({ name: 'grapple_horiz', texturePrefix: 'player', textures: [17, 18], frameRate: 16, count: -1 }),
                Animations.fromTextureList({ name: 'jump', texturePrefix: 'player', textures: [11, 12], frameRate: 12, count: -1 }),
                Animations.fromTextureList({ name: 'fall', texturePrefix: 'player', textures: [13, 14], frameRate: 12, count: -1 }),
                Animations.fromTextureList({ name: 'midair', texturePrefix: 'player', textures: [5], frameRate: 12, count: -1 }),
            ],
            defaultAnimation: 'idle',
        });

        this.behavior = new ControllerBehavior(function() {
            this.controller.left = Input.isDown('left');
            this.controller.right = Input.isDown('right');
            this.controller.jump = Input.justDown('jump')
        });
    }

    update() {
        let grounded = this.isGrounded();

        let haxis = (this.controller.left ? -1 : 0) + (this.controller.right ? 1 : 0);

        if (haxis !== 0) {
            this.v.x = haxis * this.RUN_SPEED;
        }

        let friction = grounded ? this.GROUND_FRICTION : this.AIR_FRICTION;
        if (this.v.x > 0) this.v.x = Math.max(this.v.x - friction*this.delta, 0);
        if (this.v.x < 0) this.v.x = Math.min(this.v.x + friction*this.delta, 0);

        if (grounded) {
            if (this.controller.jump) {
                this.v.y = -this.JUMP_SPEED;
            }
        }

        super.update();

        if (this.controller.left || this.controller.keys.runLeft) this.flipX = true;
        if (this.controller.right || this.controller.keys.runRight) this.flipX = false;

        if (grounded) {
            if (haxis !== 0) this.playAnimation('run');
            else this.playAnimation('idle');
        } else {
            if (this.v.y < -10) this.playAnimation('jump');
            else if (this.v.y > 20) this.playAnimation('fall');
            else this.playAnimation('midair');
        }
    }

    private isGrounded() {
        (<RectBounds>this.bounds).y++;
        let ground = this.world.select.overlap(this.bounds, ['walls']);
        (<RectBounds>this.bounds).y--;
        return !_.isEmpty(ground);
    }
}