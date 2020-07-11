class Box extends Sprite {
    carrierModule: CarrierModule;

    constructor(config: Sprite.Config) {
        super(config, {
            texture: 'debug',
            tint: 0x00FF00,
            scaleX: 2,
            scaleY: 2,
            gravityy: 200,
            bounds: { x: 0, y: 0, width: 32, height: 32 },
        });
        this.carrierModule = new CarrierModule();
    }

    postUpdate() {
        super.postUpdate();
        this.carrierModule.postUpdate(this);
    }
}