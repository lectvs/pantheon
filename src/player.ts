/// <reference path="human.ts" />

class Player extends Human {
    test: boolean;

    get isHoldingKey() { return this.heldItem && this.heldItem.type === Item.Type.KEY; }

    constructor(config: Human.Config) {
        super(config, {
            speed: 40,
            preSwingWait: 0,
            postSwingWait: 0,
            itemGrabDistance: 16,
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
            ],
        });

        this.controllerSchema = {
            left: () => Input.isDown('left'),
            right: () => Input.isDown('right'),
            up: () => Input.isDown('up'),
            down: () => Input.isDown('down'),
            useItem: () => Input.justDown('useItem'),
            pickupDropItem: () => Input.justDown('pickupDropItem'),
        };
    }

    update(delta: number) {
        super.update(delta);
        this.updateItemOutlines();
    }

    private updateItemOutlines() {
        let overlappingItem = this.getOverlappingItem();
        if (!this.test) {
            global.theater.interactionManager.highlight(overlappingItem);
        }
    }

    protected pickupItem(item: Item) {
        super.pickupItem(item);
        if (this.world && this.world.getLayerByName('above')) {
            let itemName = new ItemName({ text: item.type, font: Assets.fonts.DELUXE16, life: 1, layer: 'above' });
            itemName.x = -itemName.getTextWidth()/2;
            itemName.y = -32;
            this.addChild(itemName);
        }
    }

    protected hitStuff() {
        if (!this.heldItem) return;
        let swingHitbox = this.getSwingHitbox();
        for (let obj of this.world.worldObjects) {
            if (this.heldItem.cutsTrees && obj instanceof Tree && obj.isOverlappingRect(swingHitbox)) {
                obj.hit(obj.x - this.x);
            }
            if (this.heldItem.hurtsMonster && obj instanceof Monster && obj.isOverlappingRect(swingHitbox)) {
                obj.hit();
            }
        }
    }

    protected getSwingHitbox(): Rect {
        return {
            x: this.x - 10 + (this.flipX ? -1 : 1)*10,
            y: this.y - 8 - 18,
            width: 20,
            height: 36
        };
    }
}