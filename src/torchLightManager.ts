class TorchLightManager extends WorldObject {
    torchFuel: number;
    torchRefuelDistance = 16;
    torchFuelEmptyThreshold = 0.1;

    constructor(config: WorldObject.Config) {
        super(config);
        this.torchFuel = 0;
    }

    update(delta: number) {
        if (this.world.containsWorldObject('torch')) {
            let torch = this.world.getWorldObjectByName<Sprite>('torch');
            let campfire = this.world.getWorldObjectByName<Campfire>('campfire');

            let oldTorchFuel = this.torchFuel;
            this.torchFuel -= 0.03*delta;
            if (M.distance(campfire.x, campfire.y, torch.x, torch.y) < this.torchRefuelDistance) {
                this.torchFuel += 1*delta;
            }
            this.torchFuel = M.clamp(this.torchFuel, 0, 1);

            if (this.torchFuel <= this.torchFuelEmptyThreshold && oldTorchFuel > this.torchFuelEmptyThreshold) {
                this.torchFuel = 0;
                this.world.getWorldObjectByName<Sprite>('torchFire').addChild<Sprite>(<Sprite.Config>{
                    constructor: Sprite,
                    x: 0, y: 0,
                    texture: 'smoke',
                    scaleX: 0.5, scaleY: 0.5,
                    layer: 'above',
                    life: 2,
                    updateCallback: (delta, smoke: Sprite) => {
                        let t = smoke.life.progress;
                        let torchFire = <Sprite>smoke.parent;
                        smoke.offset.x = torchFire.offset.x + 2 * Math.exp(-t) * Math.sin(4*Math.PI*t);
                        smoke.offset.y = torchFire.offset.y + -16 * t;
                        smoke.alpha = 1-t;
                    }
                });
            }
        }

        super.update(delta);
    }
}