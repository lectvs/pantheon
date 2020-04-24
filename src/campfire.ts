namespace Campfire {
    export type Config = Sprite.Config & {
    }
}

class Campfire extends Sprite {

    introEffect: boolean;
    private introRadius = 40;

    winEffect: boolean;
    winRadius = 40;

    hitEffect: boolean;
    private hitRadius: number;
    private hitBuffer: number;
    
    private fireRadiusAtFullTime = 200;
    private fireRadiusBufferAtFull = 20;
    private fullTime = 60;

    visualFireBaseRadius: number;
    private get fireBaseRadiusGoal() {
        if (this.hitEffect) return this.hitRadius;
        if (this.winEffect) return Math.min(this.winRadius, this.visualFireBaseRadius);
        return this.fireRadiusAtFullTime * (1 - this.timer.progress);
    }
    private get trueFireBaseRadius() {
        return this.fireRadiusAtFullTime * (1 - this.timer.progress);
    }

    visualFireRadiusBuffer: number;
    fireRadiusBuffer: number;
    get fireRadiusBufferGoal() {
        if (this.hitEffect) return this.hitBuffer - this.visualFireBaseRadius;
        return this.fireRadiusBuffer;
    }
    get isOut() { return this.timer.done; }

    private logConsumptionRadius = 16;
    private timeGainedOnLogConsumptionAtZero = 25;
    private timeGainedOnLogConsumptionAtFull = 10;

    fireSprite: Sprite;
    timer: Timer;
    private currentlyConsumedItems: ItemGround[];

    hasConsumedGasoline: boolean;

    constructor(config: Campfire.Config) {
        super(config, {
            texture: 'campfire',
        });

        this.fireSprite = WorldObject.fromConfig({
            name: 'fire',
            parent: fireSpriteConfig(),
            layer: this.layer,
        });
        World.Actions.addChildToParent(this.fireSprite, this);
        this.timer = new Timer(this.fullTime);
        this.visualFireBaseRadius = this.fireBaseRadiusGoal;
        this.fireRadiusBuffer = this.fireRadiusBufferAtFull;
        this.visualFireRadiusBuffer = this.fireRadiusBufferGoal;
        this.currentlyConsumedItems = [];
        this.introEffect = false;
        this.winEffect = false;
        this.hitEffect = false;
        this.hasConsumedGasoline = false;
    }

    update(delta: number) {
        super.update(delta);

        if (!this.winEffect) this.timer.update(delta);
        let fireScale = 0.2 + (1 - this.timer.progress);
        if (this.introEffect) fireScale = 0.3;
        this.fireSprite.scaleX = fireScale;
        this.fireSprite.scaleY = fireScale;

        if (Random.boolean(5*delta)) {
            this.fireSprite.offset.y = Random.int(0, 1);
        }

        this.updateRadius(delta);
        this.updateRadiusBuffer(delta);
        this.consumeItems();
        if (global.theater.storyManager.currentNodeName === 'lose') {
            this.timer.time = this.fullTime;
        }
    }

    start() {
        this.timer.time = this.timer.duration/2;
    }

    hit() {
        this.world.runScript(S.chain(
            S.call(() => {
                this.hitRadius = 0;
                this.hitBuffer = this.visualFireBaseRadius + this.visualFireRadiusBuffer;
                this.hitEffect = true;
                this.visualFireBaseRadius = 0;
            }),
            S.wait(1),
            S.doOverTime(0.5, t => {
                this.hitRadius = this.trueFireBaseRadius;
                this.hitBuffer = this.visualFireBaseRadius + this.visualFireRadiusBuffer;
            }),
            S.call(() => {
                this.hitEffect = false;
            })
        ));
    }

    private updateRadius(delta: number) {
        let speed = 600;
        if (this.visualFireBaseRadius > this.fireBaseRadiusGoal) {
            this.visualFireBaseRadius = Math.max(this.fireBaseRadiusGoal, this.visualFireBaseRadius - speed*delta);
        } else if (this.visualFireBaseRadius < this.fireBaseRadiusGoal) {
            this.visualFireBaseRadius = Math.min(this.fireBaseRadiusGoal, this.visualFireBaseRadius + speed*delta);
        }
        if (this.introEffect) this.visualFireBaseRadius = this.introRadius;
    }

    private updateRadiusBuffer(delta: number) {
        if (this.winEffect) return;
        let speed = this.hitEffect ? 10000 : 100;
        if (this.visualFireRadiusBuffer > this.fireRadiusBufferGoal) {
            this.visualFireRadiusBuffer = Math.max(this.fireRadiusBufferGoal, this.visualFireRadiusBuffer - speed*delta);
        } else if (this.visualFireRadiusBuffer < this.fireRadiusBufferGoal) {
            this.visualFireRadiusBuffer = Math.min(this.fireRadiusBufferGoal, this.visualFireRadiusBuffer + speed*delta);
        }
    }

    private consumeItems() {
        let items = this.world.getWorldObjectsByType<ItemGround>(ItemGround).filter(item => item.consumable);

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
                World.Actions.removeWorldObjectFromWorld(item);
                A.removeAll(this.currentlyConsumedItems, item);
                if (!this.hasConsumedGasoline) {
                    let timeGainedOnLogConsumption = M.lerp(this.timeGainedOnLogConsumptionAtFull, this.timeGainedOnLogConsumptionAtZero, this.timer.progress);
                    this.timer.time -= timeGainedOnLogConsumption;
                }
            })
        ));
    }
}