class Player extends Sprite {
    private readonly speed: number = 128;
    private readonly jumpForce: number = 256;

    private crouched: boolean;
    private ignoreOneWayCollision: boolean;

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
            crouch: () => Input.isDown('down'),
            fallThrough: () => Input.justDown('down'),
        };

        this.ignoreOneWayCollision = false;
    }

    update() {
        let haxis = (this.controller.right ? 1 : 0) - (this.controller.left ? 1 : 0);
        this.updateMovement(haxis);
        this.updateCrouch();
        super.update();
    }

    updateCrouch() {
        if (this.controller.crouch && !this.crouched) {
            this.startCrouch();
            this.crouched = true;
        } else if (!this.controller.crouch && this.crouched && this.canEndCrouch()) {
            this.endCrouch();
            this.crouched = false;
        }

        if (this.controller.fallThrough) {
            this.ignoreOneWayCollision = true;
            this.runScript(S.callAfterTime(0.05, () => this.ignoreOneWayCollision = false));
        }
    }

    isCollidingWith(other: PhysicsWorldObject) {
        if (!super.isCollidingWith(other)) return false;
        if ((this.ignoreOneWayCollision || this.crouched) && other instanceof OneWayPlatform) return false;
        return true;
    }

    private updateMovement(haxis: number) {
        this.vx = haxis * this.speed;

        if (this.controller.jump) {
            this.vy = -this.jumpForce;
        }
    }

    private startCrouch() {
        this.bounds.y += 32;
        this.bounds.height = 32;
        this.scaleY = 0.5;
    }

    private canEndCrouch() {
        this.bounds.y -= 32;
        let overlappingWalls = this.world.overlapRect(this.getWorldBounds(), this.world.getPhysicsGroupsThatCollideWith(this.physicsGroup))
            .filter(obj => !(obj instanceof OneWayPlatform));
        this.bounds.y += 32;
        return _.isEmpty(overlappingWalls);
    }

    private endCrouch() {
        this.bounds.y -= 32;
        this.bounds.height = 64;
        this.scaleY = 1;
    }
}