namespace Item {
    export type Config = Sprite.Config & {
        type: Item.Type;
    };

    export enum Type {
        LOG = 'log',
        AXE = 'axe',
        KEY = 'key',
        TORCH = 'torch',
        GASOLINE = 'gasoline',
    }
}

class ItemGround extends Sprite {
    type: Item.Type;

    beingConsumed: boolean;

    private vz: number;

    private friction: number = 20000;
    private zGravity: number = 100;

    get consumable() {
        return this.type === Item.Type.LOG || this.type === Item.Type.GASOLINE;
    }

    constructor(config: Item.Config) {
        super(config, {
            texture: config.type,
            bounds: { x: 0, y: 0, width: 0, height: 0 },
            bounce: 1,
        });
        this.type = config.type;
        this.vz = 0;
        this.beingConsumed = false;
    }

    update(delta: number) {
        this.updateMovement(delta);
        super.update(delta);
    }

    private updateMovement(delta: number) {
        this.offset.y = Math.min(0, this.offset.y + this.vz*delta);
        this.vz += this.zGravity*delta;

        if (this.offset.y == 0) {
            this.vz = 0;

            if (this.vx > 0) {
                this.vx = Math.max(0, this.vx - this.friction*delta);
            } else if (this.vx < 0) {
                this.vx = Math.min(0, this.vx + this.friction*delta);
            }

            if (this.vy > 0) {
                this.vy = Math.max(0, this.vy - this.friction*delta);
            } else if (this.vy < 0) {
                this.vy = Math.min(0, this.vy + this.friction*delta);
            }
        }
    }

    asHandItem(x: number, y: number, layer: string) {
        return WorldObject.fromConfig<ItemHand>(<Item.Config>{
            constructor: ItemHand,
            layer: layer,
            offset: { x: x, y: y },
            type: this.type,
        });
    }
}

class ItemHand extends Sprite {
    type: Item.Type;

    get cutsTrees() {
        return this.type === Item.Type.AXE;
    }

    get hurtsMonster() {
        return this.type === Item.Type.AXE || this.type === Item.Type.LOG;
    }

    constructor(config: Item.Config) {
        super(config, {
            texture: config.type,
        });
        this.type = config.type;
    }

    asGroundItem(x: number, y: number, layer: string, physicsGroup: string) {
        return WorldObject.fromConfig<ItemGround>(<Item.Config>{
            constructor: ItemGround,
            x: x, y: y,
            layer: layer,
            physicsGroup: physicsGroup,
            type: this.type,
        });
    }
}

class ItemName extends SpriteText {
    life = 1;

    private lifetimer: Timer;

    constructor(config: SpriteText.Config) {
        super(config);
        this.style.color = 0x555555;
        this.lifetimer = new Timer(this.life);
    }

    update(delta: number) {
        super.update(delta);

        this.localy -= 16*delta;
        this.style.alpha = 1-this.lifetimer.progress**2;

        this.lifetimer.update(delta);
        if (this.lifetimer.done) {
            World.Actions.removeWorldObjectFromWorld(this);
        }
    }
}