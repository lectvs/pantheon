namespace Player {
    export type GrappleData = {
        grapple: Grapple;
        grappleKey: string;
    }
}

class Player extends Sprite {

    private readonly RUN_SPEED = 64;
    private readonly JUMP_SPEED = 200;
    private readonly PULL_SPEED = 200;
    private readonly GRAVITY = 800;
    private readonly FRICTION = 1000;
    private readonly WATER_DRAG = 1000;
    private readonly GRAPPLE_BREAK_TIME = 0.5;

    private grapple: Player.GrappleData;
    protected grappleColor: number;
    private bubbleTimer: Timer;

    private get isGrappling() { return this.grapple; }

    lastIsInWater: boolean;
    dead: boolean;
    private haxis: number;

    get isBoss() { return this instanceof Boss; }
    get canGrapple() { return this.state !== 'cant_grapple'; }

    constructor(tx: number, ty: number) {
        super({
            x: tx*16 + 8, y: ty*16 + 16,
            layer: 'player',
            physicsGroup: 'player',
            bounds: new RectBounds(-4, -12, 8, 12),
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'player', textures: [0, 1, 2, 3], frameRate: 12, count: -1 }),
                Animations.fromTextureList({ name: 'run', texturePrefix: 'player', textures: [5, 6, 7, 8, 9], frameRate: 12, count: -1 }),
                Animations.fromTextureList({ name: 'grapple_horiz', texturePrefix: 'player', textures: [17, 18], frameRate: 16, count: -1 }),
                Animations.fromTextureList({ name: 'jump', texturePrefix: 'player', textures: [11, 12], frameRate: 12, count: -1 }),
                Animations.fromTextureList({ name: 'fall', texturePrefix: 'player', textures: [13, 14], frameRate: 12, count: -1 }),
                Animations.fromTextureList({ name: 'dead', texturePrefix: 'player', textures: [15], frameRate: 8, count: -1 }),
            ],
            defaultAnimation: 'idle',
        });

        this.behavior = new ControllerBehavior(function() {
            this.controller.left = Input.isDown('left');
            this.controller.right = Input.isDown('right');
            this.controller.up = Input.isDown('up');
            this.controller.down = Input.isDown('down');
        });

        this.stateMachine.addState('can_grapple', {});
        this.stateMachine.addState('cant_grapple', {
            script: S.wait(this.GRAPPLE_BREAK_TIME),
            transitions: [{ toState: 'can_grapple' }]
        });
        this.setState('can_grapple');

        this.dead = false;
        this.grappleColor = 0xFFFFFF;

        this.bubbleTimer = new Timer(1, () => {
            this.world.addWorldObject(new Bubble(this.x, this.y-12));
            this.world.addWorldObject(new Bubble(this.x, this.y-10));
        }, true);
    }

    update() {
        let grounded = this.isGrounded();
        this.haxis = (this.controller.keys.runLeft ? -1 : 0) + (this.controller.keys.runRight ? 1 : 0);

        if (this.haxis !== 0) {
            this.v.x = this.haxis * this.RUN_SPEED;
        }

        if (this.controller.jump) {
            this.v.y = -this.JUMP_SPEED;
        }

        this.updateGrapple();
        this.updateWater();

        if (grounded) {
            if (this.v.x > 0) this.v.x = Math.max(this.v.x - this.FRICTION*this.delta, 0);
            if (this.v.x < 0) this.v.x = Math.min(this.v.x + this.FRICTION*this.delta, 0);
        }

        if (!this.isBoss && this.dead) {
            this.v.x = this.v.y = 0;
        }

        this.v.y = M.clamp(this.v.y, -400, 400);

        super.update();

        if (this.controller.left || this.controller.keys.runLeft) this.flipX = true;
        if (this.controller.right || this.controller.keys.runRight) this.flipX = false;

        // Patch to prevent some softlocks
        if (this.x < -16 || this.x >= 192 || this.y >= this.world.select.type(Tilemap).height + 32) {
            this.dead = true;
        }
    }

    postUpdate() {
        super.postUpdate();

        if (this.dead) {
            this.playAnimation('dead');
        } else if (!this.canGrapple) {
            this.playAnimation('fall');
        } else if (this.isGrappling) {
            if (this.grapple.grappleKey === 'left' || this.grapple.grappleKey === 'right') {
                this.playAnimation('grapple_horiz');
            } else if (this.grapple.grappleKey === 'up') {
                this.playAnimation('jump');
            } else {
                this.playAnimation('fall');
            }
        } else {
            if (this.v.y < -10) this.playAnimation('jump');
            else if (this.v.y > 20) this.playAnimation('fall');
            else if (this.haxis !== 0) this.playAnimation('run');
            else this.playAnimation('idle');
        }
    }

    updateGrapple() {        
        if (this.isGrappling) {
            if (this.dead || this.grapple.grapple.broken || !this.controller.keys[this.grapple.grappleKey]) {
                if (this.dead || this.grapple.grapple.broken) {
                    this.setState('cant_grapple');
                }
                if (!this.grapple.grapple.broken) {
                    this.grapple.grapple.removeFromWorld();
                }
                this.grapple = undefined;
            }
        }

        let grappleKey: string = undefined;
        if (this.controller.left) grappleKey = 'left';
        if (this.controller.right) grappleKey = 'right';
        if (this.controller.up) grappleKey = 'up';
        if (this.controller.down) grappleKey = 'down';

        if (!this.isGrappling && grappleKey && this.canGrapple) {
            let direction = {
                'left': Direction2D.LEFT,
                'right': Direction2D.RIGHT,
                'up': Direction2D.UP,
                'down': Direction2D.DOWN
            }[grappleKey];

            this.grapple = {
                grapple: this.world.addWorldObject(new Grapple(this, 0, -6, direction, this.grappleColor)),
                grappleKey: grappleKey
            };

            this.world.playSound('grappleshoot');
        }

        if (this.isGrappling) {
            if (this.grapple.grapple.isPulling) {
                this.v.x = this.grapple.grapple.direction.h * this.PULL_SPEED;
                this.v.y = this.grapple.grapple.direction.v * this.PULL_SPEED;
            } else {
                this.v.x = 0;
                this.v.y = 0;
            }
            this.gravity.y = 0;
        } else {
            this.gravity.y = this.GRAVITY;
        }
    }

    updateWater() {
        let isInWater = this.isInWater();
        if (isInWater) {
            this.timeScale = 0.5;
            if (this.v.x > 0) this.v.x = Math.max(this.v.x - this.WATER_DRAG*this.delta, 0);
            if (this.v.x < 0) this.v.x = Math.min(this.v.x + this.WATER_DRAG*this.delta, 0);
            this.bubbleTimer.update(this.delta*2);
        } else {
            this.timeScale = 1;
        }

        if (this.lastIsInWater !== undefined && this.lastIsInWater !== isInWater) {
            this.world.playSound('enterwater1');
            this.world.playSound('enterwater2');
            Puff.puffWater(this.world, this.x, this.y-4, { h: this.v.x, v: this.v.y });
        }
        this.lastIsInWater = isInWater;
    }

    onCollide(collision: Physics.CollisionInfo) {
        super.onCollide(collision);
        if (!this.isBoss && !this.dead) {
            if (collision.other.obj instanceof Spikes ||
                collision.other.obj instanceof Thwomp ||
                collision.other.obj instanceof Bat ||
                collision.other.obj instanceof Mover ||
                collision.other.obj instanceof Lava ||
                collision.other.obj instanceof Cannon ||
                collision.other.obj instanceof Cannonball ||
                (collision.other.obj instanceof Boss && !collision.other.obj.dead)
                    ) {
                this.dead = true;
            }
        }
    }

    playGlitchSound(volume: number = 1) {
        this.world.playSound('glitch3').volume = volume;
        this.world.playSound(Random.element(['glitch1', 'glitch4'])).volume = volume;
    }

    private isGrounded() {
        (<RectBounds>this.bounds).y++;
        let ground = this.world.select.overlap(this.bounds, ['walls']);
        (<RectBounds>this.bounds).y--;
        return !_.isEmpty(ground);
    }

    private isInWater() {
        return !_.isEmpty(this.world.select.overlap(this.bounds, ['water']));
    }
}