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
                this.transition.free();
                this.transition = undefined;

                if (this.currentWorld) {
                    this.currentWorld.onTransitioned();
                }
            }
        } else {
            this.currentWorld?.update();
        }
    }

    render(screen: Texture) {
        if (this.transition) {
            this.transition.render(screen);
        } else {
            this.currentWorld?.render(screen, 0, 0);
        }
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
        
        if (!transition.done) {
            this.transition = transition;
            this.transition.setData(oldWorld, this.currentWorld);
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
}