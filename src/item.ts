namespace Item {
    export type Config = Sprite.Config & {
        type: Item.Type;
    };
}

class Item extends Sprite {
    type: Item.Type;

    beingConsumed: boolean;

    private friction: number = 20000;

    get usable() {
        return this.type !== Item.Type.KEY && this.type !== Item.Type.GASOLINE;
    }

    get cutsTrees() {
        return this.type === Item.Type.AXE || this.type === Item.Type.MONSTERAXE;
    }

    get hurtsMonster() {
        return this.type === Item.Type.AXE || this.type === Item.Type.MONSTERAXE || this.type === Item.Type.LOG;
    }

    get consumable() {
        return this.type === Item.Type.LOG || this.type === Item.Type.GASOLINE;
    }

    get held() { return !!this.parent; }

    constructor(config: Item.Config) {
        super(config, {
            texture: config.type,
            bounds: { x: 0, y: 0, width: 0, height: 0 },
            bounce: 1,
        });
        this.type = config.type;
        this.vz = 0;
        this.gravity.z = -100;
        this.beingConsumed = false;
    }

    update(delta: number) {
        if (!this.held) {
            this.updateMovement(delta);
        }

        this.vz = this.held ? 0 : this.vz;
        this.gravity.z = this.held ? 0 : -100;

        super.update(delta);

        if (this.z <= 0) {
            this.z = 0;
            this.vz = 0;
        }

        if (this.type === Item.Type.TORCH) {
            Item.updateTorchFireSprite(this);
        }
    }

    private updateMovement(delta: number) {
        if (this.z <= 0) {
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
}

namespace Item {
    export enum Type {
        LOG = 'log',
        AXE = 'axe',
        MONSTERAXE = 'monsteraxe',
        KEY = 'key',
        TORCH = 'torch',
        GASOLINE = 'gasoline',
    }
}

class ItemName extends SpriteText {
    constructor(config: SpriteText.Config) {
        super(config);
        this.style.color = 0x555555;
    }

    update(delta: number) {
        super.update(delta);

        this.localy -= 16*delta;
        this.style.alpha = 1-this.life.progress**2;
    }
}

namespace Item {
    export function updateTorchFireSprite(item: Sprite) {
        let torchFire = item.getChildByName<Sprite>('torchFire');
        let torchLightManager = item.world.getWorldObjectByType<TorchLightManager>(TorchLightManager);
        let torchScale = torchLightManager.torchFuel;
        torchFire.scaleX = 0.7*torchScale;
        torchFire.scaleY = 0.7*torchScale;
        torchFire.offset.x = item.offset.x;
        torchFire.offset.y = item.offset.y - 4;
    }
}