class Player extends Sprite {
    readonly MAX_SPEED = 150;
    readonly JUMP_FORCE = 420;
    readonly GRAVITY_NORMAL = 800;
    readonly GRAVITY_SPIN = 400;

    private lastGrounded = true;
    private midjump = false;
    closestInteractable: Interactable;
    spinning = false;
    laying = false;
    vylimit = Infinity;

    constructor(x: number, y: number) {
        super({
            x, y,
            animations: [
                Animations.fromTextureList({ name: 'idle', texturePrefix: 'mirigram', textures: [0, 1], frameRate: 2, count: Infinity }),
                Animations.fromTextureList({ name: 'run',  texturePrefix: 'mirigram', textures: [4, 5], frameRate: 4, count: Infinity, overrides: {
                    0: { callback: () => this.world.playSound('walk') },
                    1: { callback: () => this.world.playSound('walk') },
                } }),
                Animations.fromTextureList({ name: 'jump', texturePrefix: 'mirigram', textures: [8], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'fall', texturePrefix: 'mirigram', textures: [9], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'spin', textures: ['spin'], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'laying', texturePrefix: 'mirigram', textures: [11], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'grab', texturePrefix: 'mirigram', textures: [12, 12, 12, 12, 12, 13, 12, 13, 12, 13, 12, 13], frameRate: 4, count: 1, oneOff: true, overrides: {
                    5: { callback: () => this.world.playSound('land') },
                    6: { callback: () => this.world.playSound('land').volume = 0.5 },
                    7: { callback: () => this.world.playSound('land') },
                    8: { callback: () => this.world.playSound('land').volume = 0.5 },
                    9: { callback: () => this.world.playSound('land') },
                    10: { callback: () => this.world.playSound('land').volume = 0.5 },
                    11: { callback: () => this.world.playSound('land') },
                } }),
                Animations.fromTextureList({ name: 'hold', texturePrefix: 'mirigram', textures: [14], frameRate: 1, count: Infinity, oneOff: true }),
                Animations.fromTextureList({ name: 'slam', texturePrefix: 'mirigram', textures: [15], frameRate: 1, count: Infinity, oneOff: true }),
            ],
            defaultAnimation: 'idle',
            layer: 'player',
            physicsGroup: 'player',
            bounds: new RectBounds(-8, -24, 16, 24),
        });
        
        this.behavior = new ControllerBehavior(function() {
            this.controller.left = Input.isDown('left');
            this.controller.right = Input.isDown('right');
            this.controller.jump = Input.justDown('jump');
            this.controller.keys.holdingJump = Input.isDown('jump');
            this.controller.interact = Input.justDown('interact');
        });
    }

    update() {
        let haxis = (this.controller.left ? -1 : 0) + (this.controller.right ? 1 : 0);
        let grounded = this.isGrounded(['walls']);
        this.v.x = haxis * this.MAX_SPEED;

        if (grounded) {
            if (!this.lastGrounded && this.v.y >= 0) this.world.playSound('land');
            this.midjump = false;
        }

        if (this.controller.jump && grounded) {
            this.v.y = -this.JUMP_FORCE;
            this.midjump = true;
            this.world.playSound('jump');
        }

        if (this.midjump && this.v.y < 0 && !this.controller.keys.holdingJump) {
            this.v.y /= 2;
            this.midjump = false;
        }

        if (this.spinning) {
            this.angle += 720 * this.delta;
            if (grounded) {
                this.spinning = false;
                this.laying = true;
                this.angle = 0;
            }
        }

        if (this.laying && haxis !== 0) {
            this.laying = false;
        }

        this.gravity.y = this.spinning ? this.GRAVITY_SPIN : this.GRAVITY_NORMAL;

        if (this.v.y > this.vylimit) {
            this.v.y = this.vylimit;
        }

        super.update();

        this.updateInteract(grounded);

        this.updateAnimation(haxis, grounded);

        this.updateOrb();

        this.lastGrounded = grounded;
    }

    isControlRevoked() {
        if (this.spinning) return true;
        return super.isControlRevoked();
    }

    private updateInteract(grounded: boolean) {
        if (grounded) {
            let interactables = this.world
                                    .select.typeAll(Interactable)
                                    .filter(i => i.isVisible() && this.bounds.isOverlapping(i.bounds));
            this.closestInteractable = M.argmin(interactables, i => G.distance(this, i));
        } else {
            this.closestInteractable = undefined;
        }

        if (this.controller.interact && this.closestInteractable) {
            this.controller.interact = false;
            this.closestInteractable.interact();
        }
    }

    private updateAnimation(haxis: number, grounded: boolean) {
        if (haxis < 0) {
            this.flipX = true;
        } else if (haxis > 0) {
            this.flipX = false;
        }

        let vscale = M.clamp(this.v.y / this.JUMP_FORCE, -1, 1);
        if (vscale < 0) vscale *= 2;
        this.scaleX = 1 + 0.2 * vscale;

        if (this.spinning) {
            this.playAnimation('spin');
        } else if (this.laying) {
            this.playAnimation('laying');
        } else if (!grounded) {
            if (this.v.y < 0) {
                this.playAnimation('jump');
            } else {
                this.playAnimation('fall');
            }
        } else if (haxis === 0) {
            this.playAnimation('idle');
        } else {
            this.playAnimation('run');
        }
    }

    private updateOrb() {
        if (this.isControlRevoked()) return;
        if (global.world.select.name<Orb>('orb3_final').isVisible()) return;
        let cc = this.world.select.type(CameraController);
        if (cc.sector.x === 8 && cc.sector.y === 3 && this.x > 3808) {
            global.theater.storyManager.cutsceneManager.playCutscene('collect_orb');
        }
    }
}