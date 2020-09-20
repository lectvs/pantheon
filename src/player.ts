class Player extends Sprite {
    private readonly speed: number = 128;
    private readonly jumpForce: number = 256;

    bounds: RectBounds;

    private crouched: boolean;
    private ignoreOneWayCollision: boolean;

    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'player',
            tint: 0xFF0000,
            bounds: { type: 'rect', x: -16, y: -64, width: 32, height: 64 },
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

        let bb = this.bounds.getBoundingBox();
        let grounded = !_.isEmpty(this.world.overlap(new RectBounds(bb.left + bb.width/2 - 0.5, bb.bottom, 1, 1), ['walls']))
                    || !_.isEmpty(this.world.overlap(new RectBounds(bb.left, bb.bottom, 1, 1), ['walls']))
                    || !_.isEmpty(this.world.overlap(new RectBounds(bb.right - 1, bb.bottom, 1, 1), ['walls']));
        this.tint = grounded ? 0x00FF00 : 0xFF0000;



        let haxis = (this.controller.right ? 1 : 0) - (this.controller.left ? 1 : 0);
        this.updateMovement(haxis);
        if (this.controller.jump) {
            this.vy = -this.jumpForce;
            grounded = false;
        }

        this.updateCrouch();

        this.gravityy = grounded ? 0 : 512;

        super.update();

        let wos = this.world.getPhysicsObjectsThatCollideWith(this.physicsGroup)
                        .filter(wo => (wo.bounds instanceof SlopeBounds && G.overlapRectangles(bb, wo.bounds.getBoundingBox())));
        
        if (grounded && !_.isEmpty(wos)) {
            let slope = wos[0];
            let slopeBounds = <SlopeBounds>slope.bounds;
            let slopeBoundsBox = slopeBounds.getBoundingBox();
            if (this.vy >= -1) {
                if (slopeBounds.direction === 'upleft') {
                    let newy = -slopeBoundsBox.height/slopeBoundsBox.width * (bb.right - slopeBoundsBox.left) + slopeBoundsBox.bottom;
                    this.y += newy - bb.bottom;
                } else if (slopeBounds.direction === 'upright') {
                    let newy = slopeBoundsBox.height/slopeBoundsBox.width * (bb.left - slopeBoundsBox.left) + slopeBoundsBox.top;
                    this.y += newy - bb.bottom;
                }
            }

            if (this.vy < 0) {
                this.vy = 0;
            }

        }
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
    }

    private startCrouch() {
        this.bounds.y += 32;
        this.bounds.height = 32;
        this.scaleY = 0.5;
    }

    private canEndCrouch() {
        this.bounds.y -= 32;
        let overlappingWalls = this.world.overlap(this.bounds, this.world.getPhysicsGroupsThatCollideWith(this.physicsGroup))
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