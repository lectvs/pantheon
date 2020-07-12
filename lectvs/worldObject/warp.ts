class Warp extends PhysicsWorldObject {
    stage: string;
    entryPoint: World.EntryPoint;
    transition: Transition.Config;

    constructor(config: PhysicsWorldObject.Config) {
        super(config);
        this.stage = this.data.stage;
        this.entryPoint = this.data.entryPoint;
        this.transition = this.data.transition ?? Transition.INSTANT;
    }

    warp() {
        global.theater.loadStage(this.stage, this.transition, this.entryPoint);
    }
}