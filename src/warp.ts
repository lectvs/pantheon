class Warp extends PhysicsWorldObject {
    scene: string;
    transition: Transition;

    constructor(config: PhysicsWorldObject.Config) {
        super(config);
        this.scene = O.getOrDefault(config.data.scene, "");
        this.transition = O.getOrDefault(config.data.transition, Transition.INSTANT);
    }
}