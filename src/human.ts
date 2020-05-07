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
    private itemGrabDistance: number;
    private direction: Direction2D;

    protected heldItem: Item;
    get moving() { return Math.abs(this.vx) > 1 || Math.abs(this.vy) > 1;}
    get immobile() { return this.state === 'hurt'; }

    constructor(config: Human.Config, defaults?: Human.Config) {
        config = WorldObject.resolveConfig(config, defaults);
        super(config, {
            bounds: { x: -4, y: -2, width: 8, height: 4 },
            animations: Animations.emptyList('idle_empty', 'run_empty', 'idle_holding', 'run_holding', 'throw', 'swing', 'hurt'),
        });

        this.stateMachine.addState('normal', {});
        this.stateMachine.addState('swinging', {
            script: S.chain(
                S.wait(O.getOrDefault(config.preSwingWait, 0)),
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
                S.wait(O.getOrDefault(config.postSwingWait, 0)),
            ),
            transitions: [
                { type: 'instant', toState: 'normal' }
            ]
        });
        this.stateMachine.addState('hurt', {
            callback: () => {
                this.playAnimation('hurt', 0, true);
                this.dropHeldItem();
            },
            script: S.chain(
                S.doOverTime(0.5, t => {
                    this.offset.y = -16 * Math.exp(-4*t)*Math.abs(Math.sin(4*Math.PI*t*t));
                }),
                S.waitUntil(() => !this.getCurrentAnimationName().startsWith('hurt')),
                S.call(() => {
                    this.alpha = 1;
                })
            ),
            transitions: [
                { type: 'instant', toState: 'normal' }
            ]
        });
        this.setState('normal');

        this.speed = O.getOrDefault(config.speed, 40);
        this.itemGrabDistance = O.getOrDefault(config.itemGrabDistance, 16);
        this.direction = Direction2D.RIGHT;
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
        let overlappingItem: Item = undefined;
        for (let item of this.world.getWorldObjectsByType(Item)) {
            if (item.held) continue;
            let distance = M.distance(this.x, this.y, item.x, item.y);
            if (distance < this.itemGrabDistance && distance < overlappingItemDistance && !item.beingConsumed) {
                overlappingItem = item;
                overlappingItemDistance = distance;
            }
        }

        return overlappingItem;
    }

    private handleItemPickupDrop() {
        if (this.state === 'swinging') return;
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

    protected pickupItem(item: Item) {
        if (!item) return;
        this.heldItem = this.addChild(item);
        this.heldItem.localx = 0;
        this.heldItem.localy = 0;
        this.heldItem.vx = 0;
        this.heldItem.vy = 0;
        this.heldItem.angle = 0;
        this.heldItem.offset.x = 0;
        this.heldItem.offset.y = -Human.itemOffsetY;
        World.Actions.setPhysicsGroup(this.heldItem, null);
    }

    private dropHeldItem() {
        if (!this.heldItem) return;
        let droppedItem = this.removeChild(this.heldItem);
        droppedItem.x = this.x;
        droppedItem.y = this.y;
        droppedItem.offset.x = 0;
        droppedItem.offset.y = 0;
        droppedItem.flipX = this.heldItem.flipX;
        World.Actions.setPhysicsGroup(droppedItem, 'items');
        this.heldItem = null;

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

    deleteHeldItem() {
        if (!this.heldItem) return;
        this.heldItem.removeFromWorld();
        this.heldItem = null;
    }

    hit() {
        this.setState('hurt');
    }

    protected swingItem() {
        if (this.state === 'hurt' || this.state === 'swinging') return;
        this.setState('swinging');
    }

    protected hitStuff() {}

    protected getSwingHitbox(): Rect {
        return { x: this.x, y: this.y, width: 0, height: 0 };
    }
}