namespace Player {
    export type GrabData = {
        chain: Chain;
        node: number;
    }

    export type GrappleData = {
        grapple: Grapple;
    }
}

class Player extends Sprite {

    private readonly RUN_SPEED = 64;
    private readonly RUN_ACCELERATION = 400;
    private readonly JUMP_SPEED = 200;
    private readonly AIR_FRICTION = 50;
    private readonly GROUND_FRICTION = 1000;

    private grab: Player.GrabData;
    private grapple: Player.GrappleData;

    constructor(x: number, y: number) {
        super({
            x: x, y: y,
            layer: 'player',
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
            this.controller.jump = Input.justDown('jump');
            this.controller.keys.grab = Input.isDown('grab');
        });

        this.grab = null;
        this.grapple = null;

        this.stateMachine.addState('canGrab', {});
        this.stateMachine.addState('jumpedFromGrab', {
            transitions: [{ toState: 'canGrab', delay: 0.5 }]
        });
        this.stateMachine.setState('canGrab');
    }

    update() {
        let grounded = this.isGrounded();

        let haxis = (this.controller.left ? -1 : 0) + (this.controller.right ? 1 : 0);

        this.v.x = PhysicsUtils.smartAccelerate1d(this.v.x, haxis*this.RUN_ACCELERATION, this.delta, this.RUN_SPEED);

        if (haxis === 0) {
            PhysicsUtils.applyFriction(this.v, grounded ? this.GROUND_FRICTION : this.AIR_FRICTION, 0, this.delta);
        }

        if (grounded) {
            if (this.controller.jump) {
                this.jump();
            }
        }

        this.updateGrab(haxis);

        super.update();

        if (this.controller.left || this.controller.keys.runLeft) this.flipX = true;
        if (this.controller.right || this.controller.keys.runRight) this.flipX = false;

        if (this.grab) {
            this.playAnimation('jump');
        } else if (grounded) {
            if (haxis !== 0) this.playAnimation('run');
            else this.playAnimation('idle');
        } else {
            if (this.v.y < -10) this.playAnimation('jump');
            else if (this.v.y > 20) this.playAnimation('fall');
            else this.playAnimation('midair');
        }
    }

    private jump() {
        this.v.y = -this.JUMP_SPEED;
    }

    private updateGrab(haxis: number) {
        // Grab state changes
        if (this.grab) {
            if (this.controller.jump) {
                this.grab = null;
                this.setState('jumpedFromGrab');
                this.jump();
            } else if (!this.controller.keys.grab) {
                this.grab = null;
            }
        } else if (this.grapple) {
            if (!this.controller.keys.grab) {
                this.grapple.grapple.removeFromWorld();
                this.grapple = null;
            } else if (this.grapple.grapple.finished) {
                this.grapple = null;
            }
        } else {
            if (this.controller.keys.grab && this.state === 'canGrab') {
                this.grab = this.getClosestGrab();
                if (!this.grab) {
                    let grapple = this.world.addWorldObject(new Grapple(this));
                    this.grapple = { grapple };
                }
            }
        }

        // Grab physics
        this.affectedByGravity = true;
        if (this.grab) {
            let nodePos = this.grab.chain.getNodePosition(this.grab.node);
            this.x = M.lerpTime(this.x, nodePos.x, 20, this.delta);
            this.y = M.lerpTime(this.y, nodePos.y + 8, 20, this.delta);

            let nodeVelocity = this.grab.chain.getNodeVelocity(this.grab.node);
            this.v.x = nodeVelocity.x;
            this.v.y = nodeVelocity.y;

            if (haxis !== 0) {
                this.grab.chain.applyNodeAcceleration(this.grab.node, vec2(haxis*1000, 0));
            }
        } else if (this.grapple) {
            this.v.x = 0;
            this.v.y = 0;
            this.affectedByGravity = false;
        }
    }

    private getClosestGrab() {
        let chains = this.world.select.typeAll(Chain);
        let closestGrab: Player.GrabData = undefined;
        let minDist = 10;
        for (let chain of chains) {
            let node = chain.getClosestNodeTo(this.x, this.y - 8);
            let nodePos = chain.getNodePosition(node);
            let dist = M.distance(nodePos.x, nodePos.y, this.x, this.y - 8);
            if (dist < minDist) {
                closestGrab = { chain, node };
                minDist = dist;
            }
        }
        return closestGrab;
    }

    private isGrounded() {
        (<RectBounds>this.bounds).y++;
        let ground = this.world.select.overlap(this.bounds, ['walls']);
        (<RectBounds>this.bounds).y--;
        return !_.isEmpty(ground);
    }
}