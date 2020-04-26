class Campfire extends Sprite {
    private fireSprite: Sprite;

    private fireRadius: FireRadius;
    private fireBuffer: FireBuffer;

    private readonly logConsumptionRadius = 16;
    private currentlyConsumedItems: ItemGround[];

    get isOut() { return this.fireRadius.getRadiusPercent() === 0; }
    hasConsumedGasoline: boolean;

    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'campfire',
        });

        this.fireSprite = this.addChild<Sprite>({
            name: 'fire',
            parent: fireSpriteConfig(),
            layer: this.layer,
        });

        this.fireRadius = new FireRadius();
        this.fireBuffer = new FireBuffer();
        this.currentlyConsumedItems = [];
        this.hasConsumedGasoline = false;
    }

    update(delta: number) {
        super.update(delta);
        this.consumeItems();

        this.fireRadius.update(delta);

        let fireScale = 0.2 + this.fireRadius.getRadiusPercent();
        this.fireSprite.scaleX = fireScale;
        this.fireSprite.scaleY = fireScale;

        if (Random.boolean(5*delta)) {
            this.fireSprite.offset.y = Random.int(0, 1);
        }
    }

    extinguish() {
        this.fireSprite.alpha = 0;
    }

    getBuffer() {
        return this.fireBuffer.getBuffer();
    }

    getRadius() {
        return this.fireRadius.getRadius();
    }

    startBurn() {
        this.fireRadius.startBurn();
    }

    stopBurn() {
        this.fireRadius.stopBurn();
    }

    win() {
        this.fireRadius.win();
    }

    private consumeItems() {
        let items = this.world.getWorldObjectsByType(ItemGround).filter(item => item.consumable);

        for (let item of items) {
            if (_.contains(this.currentlyConsumedItems, item)) continue;
            if (item.offset.y < -4) continue;
            if (M.distance(item.x, item.y, this.x, this.y) > this.logConsumptionRadius) continue;
            this.consumeItem(item);
        }
    }

    private consumeItem(item: ItemGround) {
        this.currentlyConsumedItems.push(item);
        item.beingConsumed = true;
        if (item.type === Item.Type.GASOLINE) {
            this.hasConsumedGasoline = true;
        }

        this.world.runScript(S.chain(
            item.type !== Item.Type.GASOLINE
                ? S.doOverTime(0.5, t => { item.alpha = 1 - t; })
                : S.doOverTime(4, t => {
                    if (Random.boolean(1-t)) {
                        item.alpha = 1 - item.alpha;
                    }
                    if (t == 1) item.alpha = 0;
                }),
            S.call(() => {
                item.world.removeWorldObject(item);
                A.removeAll(this.currentlyConsumedItems, item);
                if (!this.hasConsumedGasoline) {
                    this.fireRadius.increaseTime();
                    this.fireBuffer.increaseBuffer();
                }
            })
        ));
    }
}