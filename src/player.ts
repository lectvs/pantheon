class Player extends Sprite {
    direction: Direction2D;
    test: boolean;

    private speed: number = 40;
    private throwSpeed: number = 80;
    private hurtDropSpeed: number = 40;
    private swingTime: number = 0.15;

    private itemOffsetY: number = 20;
    private itemFullSwingOffsetX: number = 10;

    heldItem: ItemHand;
    private swingScript: Script;

    get swinging() { return this.swingScript && this.swingScript.running; }
    get heldItemName() { return this.heldItem ? this.heldItem.name : undefined; }

    get moving() { return Math.abs(this.vx) > 1 || Math.abs(this.vy) > 1;}

    constructor(config: Sprite.Config) {
        super(config, {
            bounds: { x: -4, y: -2, width: 8, height: 4 },
            animations: [
                Animations.fromTextureList({ name: 'idle_empty', texturePrefix: 'player_', textures: [0, 1, 2], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run_empty', texturePrefix: 'player_', textures: [4, 5, 6, 7], frameRate: 16, count: -1 }),
                Animations.fromTextureList({ name: 'idle_holding', texturePrefix: 'player_', textures: [8, 9, 10], frameRate: 8, count: -1 }),
                Animations.fromTextureList({ name: 'run_holding', texturePrefix: 'player_', textures: [12, 13, 14, 15], frameRate: 16, count: -1 }),
                Animations.fromTextureList({ name: 'throw', texturePrefix: 'player_', textures: [16, 17, 17, 17, 17], frameRate: 24, count: 1, forceRequired: true }),
                Animations.fromTextureList({ name: 'swing', texturePrefix: 'player_', textures: [16, 17, 17, 17, 16], frameRate: 24, count: 1, forceRequired: true }),
                Animations.fromTextureList({ name: 'hurt', texturePrefix: 'player_', textures: [20, 20, 20, 20, 20, 20, 20, 20,
                                                                                                21, 22, 23, 22, 21, 22, 23, 22], frameRate: 16, count: 1, forceRequired: true }),
                Animations.fromTextureList({ name: 'intro_idle', texturePrefix: 'player_', textures: [0, 1, 2], frameRate: 2, count: 3, forceRequired: true }),
            ]
        });

        this.controllerSchema = {
            left: () => Input.isDown('left'),
            right: () => Input.isDown('right'),
            up: () => Input.isDown('up'),
            down: () => Input.isDown('down'),
            useItem: () => Input.justDown('useItem'),
            pickupDropItem: () => Input.justDown('pickupDropItem'),
        };

        this.direction = Direction2D.RIGHT;
        this.test = false;
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
        this.handleItemPickupDrop();

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
        let campfire = this.world.getWorldObjectByType(Campfire);
        campfire.hit();
        this.playAnimation('hurt', 0, true);
        if (this.swingScript) this.swingScript.done = true;
        if (this.heldItem) this.dropHeldItem();
        this.world.runScript(S.chain(
            S.call(() => {
                this.controllable = false;
            }),
            S.doOverTime(0.5, t => {
                this.offset.y = -16 * Math.exp(-4*t)*Math.abs(Math.sin(4*Math.PI*t*t));
            }),
            S.wait(0.5),
            S.call(() => {
                this.alpha = 1;
                this.controllable = true;
            })
        ));
    }

    private updateMovement(haxis: number, vaxis: number) {
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

    private handleItemPickupDrop() {
        let overlappingItemDistance = Infinity;
        let overlappingItem: ItemGround;
        for (let item of this.world.getWorldObjectsByType<ItemGround>(ItemGround)) {
            let distance = M.distance(this.x, this.y, item.x, item.y);
            if (distance < 16 && distance < overlappingItemDistance && !item.beingConsumed) {
                overlappingItem = item;
                overlappingItemDistance = distance;
            }
            if (!this.test) item.effects.outline.enabled = false;
        }

        if (overlappingItem) {
            overlappingItem.effects.outline.color = 0xFFFF00;
            overlappingItem.effects.outline.enabled = true;
            
            if (this.controller.pickupDropItem && !this.swinging) {
                if (this.heldItem) {
                    this.dropHeldItem();
                    if (!this.moving) this.pickupItem(overlappingItem);
                } else {
                    this.pickupItem(overlappingItem);
                }
            }

            return;
        }

        if (this.heldItem) {
            if (this.controller.pickupDropItem && !this.swinging) {
                this.dropHeldItem();
            }            
            return;
        }
    }

    private handleItemUse() {
        if (!this.heldItem) return;
        if (this.heldItem.type === Item.Type.KEY) return;
        this.swingItem();
    }

    private dropHeldItem() {
        if (!this.heldItem) return;
        let droppedItem = this.heldItem.asGroundItem(this.x, this.y, this.layer, 'items');
        droppedItem.flipX = this.heldItem.flipX;
        World.Actions.removeWorldObjectFromWorld(this.heldItem);
        World.Actions.addWorldObjectToWorld(droppedItem, this.world);
        World.Actions.setName(droppedItem, this.heldItem.name);
        this.heldItem = null;

        if (this.getCurrentAnimationName() === 'hurt') {
            // toss randomly
            droppedItem.offset.x = 0;
            droppedItem.offset.y = -this.itemOffsetY;
            let v = Random.onCircle(this.hurtDropSpeed);
            droppedItem.vx = v.x;
            droppedItem.vy = v.y;
            return;
        }

        if (this.moving) {
            // throw instead of drop
            droppedItem.offset.x = 0;
            droppedItem.offset.y = -this.itemOffsetY;
            droppedItem.vx = this.throwSpeed * Math.sign(this.vx);
            droppedItem.vy = this.throwSpeed * Math.sign(this.vy);
            this.playAnimation('throw', 0, true);
            return;
        }
    }

    removeHeldItem() {
        World.Actions.removeWorldObjectFromWorld(this.heldItem);
        this.heldItem = null;
    }

    private pickupItem(item: ItemGround) {
        if (!item) return;
        this.heldItem = item.asHandItem(0, -this.itemOffsetY, this.layer);
        World.Actions.addChildToParent(this.heldItem, this);
        World.Actions.removeWorldObjectFromWorld(item);
        World.Actions.setName(this.heldItem, item.name);

        if (this.world.getLayerByName('above')) {
            let itemName = new ItemName({ text: item.type, font: Assets.fonts.DELUXE16, life: 1, layer: 'above' });
            itemName.x = -itemName.getTextWidth()/2;
            itemName.y = -32;
            World.Actions.addChildToParent(itemName, this);
        }
    }

    private swingItem() {
        if (!this.swingScript || this.swingScript.done) {
            this.swingScript = this.world.runScript(S.chain(
                S.simul(
                    S.doOverTime(this.swingTime, t => {
                        if (!this.heldItem) return;
                        let angle = (this.flipX ? -1 : 1) * 90 * Math.sin(Math.PI * Math.pow(t, 0.5));
                        this.heldItem.offset.x = this.itemFullSwingOffsetX * Math.sin(M.degToRad(angle));
                        this.heldItem.offset.y = this.itemOffsetY * -Math.cos(M.degToRad(angle));
                        this.heldItem.angle = angle;
                    }),
                    S.chain(
                        S.call(() => this.playAnimation('swing', 0, true)),
                        S.wait(this.swingTime * 0.25),
                        S.call(() => {
                            this.hitStuff(this.heldItem);
                        })
                    )
                ),
            ));
        }
    }

    private hitStuff(item: ItemHand) {
        if (!item) return;
        let swingHitbox = this.getSwingHitbox();
        for (let obj of this.world.worldObjects) {
            if (item.cutsTrees && obj instanceof Tree && obj.isOverlappingRect(swingHitbox)) {
                obj.hit();
            }
            if (item.hurtsMonster && obj instanceof Monster && obj.isOverlappingRect(swingHitbox)) {
                obj.hit();
            }
        }
    }

    private getSwingHitbox(): Rect {
        return {
            x: this.x - 10 + (this.flipX ? -1 : 1)*10,
            y: this.y - 8 - 18,
            width: 20,
            height: 36
        };
    }
}