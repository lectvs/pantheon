class Campfire extends Sprite {
    private fireSprite: Sprite;
    private fireSound: Sound;
    private fireSoundVolume: number;

    private fireRadius: FireRadius;
    private fireBuffer: FireBuffer;

    private readonly logConsumptionRadius = 20;
    private currentlyConsumedItems: Item[];

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
        this.fireSoundVolume = 1;
    }

    update(delta: number) {
        super.update(delta);
        this.updateSound();
        this.consumeItems();

        this.fireRadius.update(delta);

        let fireScale = 0.2 + this.fireRadius.getRadiusPercent();
        this.fireSprite.scaleX = fireScale;
        this.fireSprite.scaleY = fireScale;

        if (Random.boolean(5*delta)) {
            this.fireSprite.offset.y = Random.int(0, 1);
        }
    }

    updateSound() {
        if (!this.fireSound) {
            this.fireSound = this.world.playSound('fire');
            this.fireSound.loop = true;
        }

        let player = this.world.getWorldObjectByType(Player);
        let distance = M.distance(player.x, player.y, this.x, this.y);
        let volume = this.fireSoundVolume * Math.max(1 - distance/200, 0);
        this.fireSound.volume = volume;
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

    stopFireBurnSound() {
        this.fireSoundVolume = 0;
    }

    win() {
        this.fireRadius.win();
    }

    private consumeItems() {
        let items = this.world.getWorldObjectsByType(Item).filter(item => item.consumable && !item.held);

        for (let item of items) {
            if (_.contains(this.currentlyConsumedItems, item)) continue;
            if (item.z > 15) continue;
            if (M.distance(item.x, item.y, this.x, this.y) > this.logConsumptionRadius) continue;
            this.consumeItem(item);
        }
    }

    private consumeItem(item: Item) {
        if (item.type === Item.Type.LOG) {
            this.world.addWorldObjects(LogPiece.getLogPieces(item));
            this.world.removeWorldObject(item);
            this.world.playSound('itemburn');
            this.runScript(S.chain(
                S.wait(0.5),
                S.call(() => {
                    this.fireRadius.increaseTime();
                    if (item.name !== 'start_log') {
                        // Don't increase the buffer for the first log (helps make the intro cutscene look good)
                        this.fireBuffer.increaseBuffer();
                    }
                })
            ));
        }

        if (item.type === Item.Type.GASOLINE) {
            this.currentlyConsumedItems.push(item);
            item.beingConsumed = true;
            this.hasConsumedGasoline = true;
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
                })
            ));
        }
    }
}