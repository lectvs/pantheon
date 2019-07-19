class Warp extends PhysicsWorldObject {
    stage: string;
    transition: Transition;

    constructor(config: PhysicsWorldObject.Config) {
        super(config);
        this.stage = config.data.stage;
        this.transition = O.getOrDefault(config.data.transition, Transition.INSTANT);
    }
}