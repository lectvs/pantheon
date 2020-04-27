namespace Human {
    export type Config = Sprite.Config & {
        speed?: number;
        preSwingWait?: number;
        postSwingWait?: number;
        itemGrabDistance?: number;
    }
}

class Human extends Sprite {
    private static readonly throwSpeed: number = 80;
    private static readonly hurtDropSpeed: number = 40;
    private static readonly swingTime: number = 0.15;

    private static readonly itemOffsetY: number = 20;
    private static readonly itemFullSwingOffsetX: number = 10;

    private speed: number;
    private preSwingWait: number;
    private postSwingWait: number;
    private itemGrabDistance: number;
    private direction: Direction2D;

    private swingScript: Script;
    private hurtScript: Script;

    protected heldItem: ItemHand;
    protected stunned: boolean;
    get swinging() { return this.swingScript && this.swingScript.running; }
    get moving() { return Math.abs(this.vx) > 1 || Math.abs(this.vy) > 1;}
    get hurt() { return this.hurtScript && !this.hurtScript.done; }
    get immobile() { return this.stunned; }

    constructor(config: Human.Config, defaults?: Human.Config) {
        config = WorldObject.resolveConfig(config, defaults);
        super(config, {
            bounds: { x: -4, y: -2, width: 8, height: 4 },
            animations: Animations.emptyList('idle_empty', 'run_empty', 'idle_holding', 'run_holding', 'throw', 'swing', 'hurt'),
        });

        this.speed = O.getOrDefault(config.speed, 40);
        this.preSwingWait = O.getOrDefault(config.preSwingWait, 0);
        this.postSwingWait = O.getOrDefault(config.postSwingWait, 0);
        this.itemGrabDistance = O.getOrDefault(config.itemGrabDistance, 16);
        this.direction = Direction2D.RIGHT;
    }

    onRemove() {
        if (this.swingScript) this.swingScript.done = true;
        if (this.hurtScript) this.hurtScript.done = true;
    }

    update(delta: number) {
        let haxis = (this.controller.right ? 1 : 0) - (this.controller.left ? 1 : 0);
        let vaxis = (this.controller.down ? 1 : 0) - (this.controller.up ? 1 : 0);

        this.updateMovement(haxis, vaxis);
        super.update(delta);

        if (this.heldItem) {
            this.heldItem.flipX = this.flipX;
        }

        if (this.controller.useItem) {
            this.handleItemUse();
        }
        if (this.controller.pickupDropItem) {
            this.handleItemPickupDrop();
        }

        // Handle animation.
        let anim_state = (haxis == 0 && vaxis == 0) ? 'idle' : 'run';
        let holding = this.heldItem ? 'holding' : 'empty';

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
        if (this.hurt) return;
        this.playAnimation('hurt', 0, true);
        if (this.swingScript) this.swingScript.done = true;
        if (this.heldItem) this.dropHeldItem();
        this.stunned = true;
        this.hurtScript = this.world.runScript(S.chain(
            S.doOverTime(0.5, t => {
                this.offset.y = -16 * Math.exp(-4*t)*Math.abs(Math.sin(4*Math.PI*t*t));
            }),
            S.waitUntil(() => !this.getCurrentAnimationName().startsWith('hurt')),
            S.call(() => {
                this.alpha = 1;
                this.stunned = false;
            })
        ));
    }

    private updateMovement(haxis: number, vaxis: number) {
        if (this.immobile) {
            haxis = 0;
            vaxis = 0;
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

    protected getOverlappingItem() {
        let overlappingItemDistance = Infinity;
        let overlappingItem: ItemGround = undefined;
        for (let item of this.world.getWorldObjectsByType(ItemGround)) {
            let distance = M.distance(this.x, this.y, item.x, item.y);
            if (distance < this.itemGrabDistance && distance < overlappingItemDistance && !item.beingConsumed) {
                overlappingItem = item;
                overlappingItemDistance = distance;
            }
        }

        return overlappingItem;
    }

    private handleItemPickupDrop() {
        if (this.swinging) return;
        if (this.immobile) return;
        
        let overlappingItem = this.getOverlappingItem();
        if (this.heldItem) {
            this.dropHeldItem();
            if (this.moving) return;
        }
        if (overlappingItem) {
            this.pickupItem(overlappingItem);
        }
    }

    private handleItemUse() {
        if (!this.heldItem) return;
        if (!this.heldItem.usable) return;
        if (this.immobile) return;
        this.swingItem();
    }

    private dropHeldItem() {
        if (!this.heldItem) return;
        let droppedItem = this.heldItem.asGroundItem(this.x, this.y, this.layer, 'items');
        droppedItem.flipX = this.heldItem.flipX;
        let heldItemName = this.heldItem.name;
        this.removeHeldItem();
        this.world.addWorldObject(droppedItem);
        World.Actions.setName(droppedItem, heldItemName);

        if (this.getCurrentAnimationName() === 'hurt') {
            // toss randomly
            droppedItem.offset.x = 0;
            droppedItem.offset.y = -Human.itemOffsetY;
            let v = Random.onCircle(Human.hurtDropSpeed);
            droppedItem.vx = v.x;
            droppedItem.vy = v.y;
            return;
        }

        if (this.moving) {
            // throw instead of drop
            droppedItem.offset.x = 0;
            droppedItem.offset.y = -Human.itemOffsetY;
            droppedItem.vx = Human.throwSpeed * Math.sign(this.vx);
            droppedItem.vy = Human.throwSpeed * Math.sign(this.vy);
            this.playAnimation('throw', 0, true);
            return;
        }
    }

    removeHeldItem() {
        this.heldItem.removeFromWorld();
        this.heldItem = null;
    }

    protected pickupItem(item: ItemGround) {
        if (!item) return;
        this.heldItem = item.asHandItem(0, -Human.itemOffsetY, this.layer);
        this.addChild(this.heldItem);
        item.removeFromWorld();
        World.Actions.setName(this.heldItem, item.name);
    }

    protected swingItem() {
        if (!this.world) return;
        if (!this.swingScript || this.swingScript.done) {
            this.swingScript = this.world.runScript(S.chain(
                S.wait(this.preSwingWait),
                S.simul(
                    S.doOverTime(Human.swingTime, t => {
                        if (!this.heldItem) return;
                        let angle = (this.flipX ? -1 : 1) * 90 * Math.sin(Math.PI * Math.pow(t, 0.5));
                        this.heldItem.offset.x = Human.itemFullSwingOffsetX * Math.sin(M.degToRad(angle));
                        this.heldItem.offset.y = Human.itemOffsetY * -Math.cos(M.degToRad(angle));
                        this.heldItem.angle = angle;
                        if (t === 1) this.heldItem.angle = 0;
                    }),
                    S.chain(
                        S.call(() => this.playAnimation('swing', 0, true)),
                        S.wait(Human.swingTime * 0.25),
                        S.call(() => {
                            this.hitStuff();
                        })
                    )
                ),
                S.wait(this.postSwingWait),
            ));
        }
    }

    protected hitStuff() {

    }

    protected getSwingHitbox(): Rect {
        return { x: this.x, y: this.y, width: 0, height: 0 };
    }
}