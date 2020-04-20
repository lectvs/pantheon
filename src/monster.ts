class Monster extends Sprite {
    speed = 10;
    direction: Direction2D;

    private attackDistance = 16;
    private swingTime: number = 0.3;

    private itemOffsetY: number = 20;
    private itemFullSwingOffsetX: number = 10;

    private heldItem: ItemHand;
    private swingScript: Script;

    private attackdx: number;
    private attackdy: number;

    private stunned: boolean;
    get immobile() { return this.stunned || (this.swingScript && this.swingScript.running); }

    constructor(config: Sprite.Config) {
        super(config, {
            bounds: { x: -4, y: -2, width: 8, height: 4 },
            animations: [
                Animations.fromTextureList({ name: 'idle_holding', texturePrefix: 'monster_', textures: [0, 1, 2], frameRate: 4, count: -1 }),
                Animations.fromTextureList({ name: 'walk_holding', texturePrefix: 'monster_', textures: [4, 5, 6, 7], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'swing', texturePrefix: 'monster_', textures: [9, 9, 9, 8], frameRate: 8, count: 1, forceRequired: true }),
                Animations.fromTextureList({ name: 'hurt', texturePrefix: 'monster_', textures: [12, 12, 12, 12, 12, 12, 12, 12,
                                                                                                13, 14, 15, 14, 13, 14, 15, 14], frameRate: 8, count: 1, forceRequired: true }),
            ]
        });

        this.direction = Direction2D.RIGHT;
        this.attackdx = 0;
        this.attackdy = 0;

        this.heldItem = WorldObject.fromConfig(<Item.Config>{
            constructor: ItemHand,
            type: Item.Type.AXE,
            offset: { x: 0, y: -this.itemOffsetY },
            layer: 'main',
        });
        World.Actions.addChildToParent(this.heldItem, this);
    }

    onRemove() {
        if (this.swingScript) this.swingScript.done = true;
    }

    update(delta: number) {
        let player = this.world.getWorldObjectByName('player');

        let haxis = 0;
        let vaxis = 0;
        if (!this.immobile) {
            haxis = player.x - this.x;
            vaxis = player.y - this.y;
            if (-2 < haxis && haxis < 2) haxis = 0;
            if (-2 < vaxis && vaxis < 2) vaxis = 0;
        }

        this.updateMovement(haxis, vaxis);
        super.update(delta);

        this.attackdx = player.x - this.x;
        this.attackdy = player.y - this.y;
        let mag = M.magnitude(this.attackdx, this.attackdy);
        if (mag !== 0) {
            this.attackdx /= mag;
            this.attackdy /= mag;
        }

        if (this.heldItem) {
            this.heldItem.flipX = this.flipX;
        }

        this.handleAttacking();

        // Handle animation.
        let anim_state = (haxis == 0 && vaxis == 0) ? 'idle' : 'walk';
        let holding = this.heldItem ? 'holding' : 'empty';
        //let anim_dir = this.direction.v == Direction.UP ? 'up' : (this.direction.h == Direction.NONE ? 'down' : 'side');

        this.playAnimation(`${anim_state}_${holding}`);
    }

    render(screen: Texture) {
        super.render(screen);

        if (this.debugBounds) {
            let shb = this.getSwingHitbox();
            Draw.brush.color = 0x00FF00;
            Draw.rectangleOutline(screen, shb.x, shb.y, shb.width, shb.height);
        }
    }

    hit() {
        this.playAnimation('hurt', 0, true);
        this.world.runScript(S.chain(
            S.call(() => {
                this.stunned = true;
                if (this.swingScript) {
                    this.swingScript.done = true;
                }
                this.heldItem.visible = false;
            }),
            S.doOverTime(0.5, t => {
                this.offset.y = -16 * Math.exp(-4*t)*Math.abs(Math.sin(4*Math.PI*t*t));
            }),
            S.wait(1.5),
            S.call(() => {
                this.alpha = 1;
                this.stunned = false;
                this.heldItem.visible = true;
            })
        ));
    }

    private updateMovement(haxis: number, vaxis: number) {
        if (this.swingScript && this.swingScript.running) {
            this.vx = 0;
            this.vy = 0;
            return;
        }

        let player = this.world.getWorldObjectByName('player');
        if (player.x < this.x) {
            this.vx = -this.speed;
        }

        if (haxis < 0) {
            this.vx = -this.speed;
            this.direction.h = Direction.LEFT;
            if (vaxis == 0) this.direction.v = Direction.NONE;
            this.flipX = true;
        } else if (haxis > 0) {
            this.vx = this.speed;
            this.direction.h = Direction.RIGHT;
            if (vaxis == 0) this.direction.v = Direction.NONE;
            this.flipX = false;
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
    }

    private handleAttacking() {
        if (this.immobile) return;

        let player = this.world.getWorldObjectByName('player');

        if (M.distance(this.x, this.y, player.x, player.y) < this.attackDistance) {
            this.swingItem();
        }
    }

    private swingItem() {
        if (!this.swingScript || this.swingScript.done) {
            let swingHitbox = this.getSwingHitbox();
            this.swingScript = this.world.runScript(S.chain(
                S.wait(0.3),
                S.simul(
                    S.doOverTime(this.swingTime, t => {
                        let angle = (this.flipX ? -1 : 1) * 90 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.5)), 0.1);
                        this.heldItem.offset.x = this.itemFullSwingOffsetX * Math.sin(M.degToRad(angle));
                        this.heldItem.offset.y = this.itemOffsetY * -Math.cos(M.degToRad(angle));
                        this.heldItem.angle = angle;
                        if (t == 1) this.heldItem.angle = 0;
                    }),
                    S.chain(
                        S.playAnimation(this, 'swing', 0, true, false),
                        S.wait(this.swingTime * 0.25),
                        S.call(() => {
                            this.hitPlayer(swingHitbox);
                        })
                    )
                ),
                S.wait(2),
            ));
        }
    }

    private hitPlayer(swingHitbox: Rect) {
        if (!this.world) return;
        let player = this.world.getWorldObjectByName<Player>('player');

        if (player.isOverlappingRect(swingHitbox)) {
            player.hit();
        }
    }

    private getSwingHitbox(): Rect {
        return {
            x: this.x - 8 + this.attackdx*8,
            y: this.y - 8 + this.attackdy*8,
            width: 16,
            height: 16
        };
    }
}