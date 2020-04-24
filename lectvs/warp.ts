class Warp extends PhysicsWorldObject {
    stage: string;
    entryPoint: World.EntryPoint;
    transition: Transition.Config;

    constructor(config: PhysicsWorldObject.Config) {
        super(config);
        this.stage = config.data.stage;
        this.entryPoint = config.data.entryPoint;
        this.transition = O.getOrDefault(config.data.transition, Transition.INSTANT);
    }

    warp() {
        global.theater.loadStage(this.stage, this.transition, this.entryPoint);
    }
}