class StageManager {
    currentWorld: World;
    currentWorldAsWorldObject: Theater.WorldAsWorldObject;
    currentWorldFactory: () => World;

    private transition: Transition;
    get transitioning() { return !!this.transition; }

    private theater: Theater;

    constructor(theater: Theater) {
        this.theater = theater;
        this.currentWorld = null;
        this.currentWorldAsWorldObject = null;
    }

    /**
     * Loads a stage immediately. If you are calling from inside your game, you probably want to call Theater.loadStage
     */
    internalLoadStage(stage: () => World, transition: Transition, onTransitioned: (world: World) => void) {
        let oldWorld = this.currentWorld;

        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorldAsWorldObject);
        }

        // Create new stuff
        this.currentWorldFactory = stage;
        this.currentWorld = stage();
        this.currentWorldAsWorldObject = new Theater.WorldAsWorldObject(this.currentWorld);
        this.currentWorldAsWorldObject.name = 'world';
        this.currentWorldAsWorldObject.layer = Theater.LAYER_WORLD;
        this.theater.addWorldObject(this.currentWorldAsWorldObject);

        this.theater.onStageLoad();
        this.currentWorld.update();
        
        let newWorld = this.currentWorld;

        this.currentWorldAsWorldObject.setActive(false);
        this.currentWorldAsWorldObject.setVisible(false);

        // this is outside the script to avoid 1-frame flicker
        this.transition = transition.withData(oldWorld, newWorld);
        this.transition.layer = Theater.LAYER_TRANSITION;
        this.theater.addWorldObject(this.transition);
        this.transition.takeWorldSnapshots();
        this.transition.start();

        this.theater.runScript(S.chain(
            S.waitUntil(() => this.transition.done),
            S.call(() => {
                World.Actions.removeWorldObjectFromWorld(this.transition);
                this.transition.freeWorldSnapshots();
                this.transition = null;
                this.currentWorldAsWorldObject.setActive(true);
                this.currentWorldAsWorldObject.setVisible(true);
                this.currentWorld.onTransitioned();
                onTransitioned(this.currentWorld);
            }),
        )).update(this.theater.delta);  // Update once in case the transition is already done (i.e. instant)
    }

    /**
     * Reloads the current stage immediately. If you are calling from inside your game, you probably want to call Theater.reloadCurrentStage
     */
    internalReloadCurrentStage(transition: Transition) {
        this.internalLoadStage(this.currentWorldFactory, transition, Utils.NOOP);
    }
}