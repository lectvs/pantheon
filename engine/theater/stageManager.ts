class StageManager {
    currentWorld: World | undefined;
    currentWorldFactory: (() => World) | undefined;

    private theater: Theater;
    private transition: Transition | undefined;

    constructor(theater: Theater) {
        this.theater = theater;
    }

    update() {
        if (this.transition) {
            this.transition.update(this.theater.delta);
            if (this.transition.done) {
                this.finishTransition();
            }
        } else {
            this.currentWorld?.update();
        }
    }

    render() {
        if (this.transition) {
            return this.transition.render();
        }
        return this.currentWorld?.render();
    }

    /**
     * Loads a stage immediately. If you are calling from inside your game, you probably want to call Theater.loadStage
     */
    internalLoadStage(stage: () => World, transition: Transition) {
        let oldWorld = this.currentWorld;

        this.currentWorldFactory = stage;
        this.currentWorld = stage();

        this.theater.onStageLoad();
        this.currentWorld.update();
        
        this.transition = transition;
        this.transition.setData(oldWorld, this.currentWorld);
        if (this.transition.done) {
            this.finishTransition();
        }
    }

    /**
     * Reloads the current stage immediately. If you are calling from inside your game, you probably want to call Theater.reloadCurrentStage
     */
    internalReloadCurrentStage(transition: Transition) {
        if (!this.currentWorldFactory) {
            console.error("Tried to reload current stage, but no stage loaded in StageManager");
            return;
        }
        this.internalLoadStage(this.currentWorldFactory, transition);
    }

    private finishTransition() {
        if (this.transition) {
            this.transition.free();
            this.transition = undefined;
        }

        if (this.currentWorld) {
            this.currentWorld.onTransitioned();
        }
    }
}