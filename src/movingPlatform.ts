class MovingPlatform extends Sprite {
    pathStart: Pt;
    pathEnd: Pt;

    pathTimer: Timer;
    carrierModule: CarrierModule;

    constructor(config: Sprite.Config) {
        super(config);
        this.pathStart = config.data.pathStart;
        this.pathEnd = config.data.pathEnd;
        this.x = this.pathStart.x;
        this.y = this.pathStart.y;

        this.pathTimer = new Timer(Infinity);
        this.pathTimer.speed = 2;
        this.carrierModule = new CarrierModule(this);
    }

    update(delta: number) {
        super.update(delta);
        this.pathTimer.update(delta);
        this.x = M.lerp(this.pathStart.x, this.pathEnd.x, (1 - Math.cos(this.pathTimer.time))/2);
        this.y = M.lerp(this.pathStart.y, this.pathEnd.y, (1 - Math.cos(this.pathTimer.time))/2);
    }

    postUpdate() {
        super.postUpdate();
        this.carrierModule.postUpdate();
    }
}