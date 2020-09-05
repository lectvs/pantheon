class Box extends Sprite {
    carrierModule: CarrierModule;

    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'debug',
            tint: 0x660000,
            scaleX: 2,
            scaleY: 2,
            gravityy: 200,
            bounds: { type: 'circle', x: 0, y: 0, radius: 16 },
        });
        this.carrierModule = new CarrierModule(this);
    }

    update() {
        //this.vx *= 0.98;
        super.update();
    }

    postUpdate() {
        super.postUpdate();
        this.carrierModule.postUpdate();
    }
}