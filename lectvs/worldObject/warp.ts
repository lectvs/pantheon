class Warp extends PhysicsWorldObject {
    stage: string;
    entryPoint: World.EntryPoint;
    transition: Transition.Config;

    constructor(stage: string, entryPoint: World.EntryPoint, transition: Transition.Config = Transition.INSTANT) {
        super();
        this.stage = stage;
        this.entryPoint = entryPoint;
        this.transition = transition;
    }

    warp() {
        global.theater.loadStage(this.stage, this.transition, this.entryPoint);
    }
}