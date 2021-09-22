class StageManager {
    currentWorld: World;
    currentWorldAsWorldObject: Theater.WorldAsWorldObject;

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
    internalLoadStage(stage: () => World, transition: Transition) {
        let oldWorld = this.currentWorld;

        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorldAsWorldObject);
        }

        // Create new stuff
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

        let stageManager = this;
        this.theater.runScript(function* () {
            while (!stageManager.transition.done) {
                yield;
            }

            World.Actions.removeWorldObjectFromWorld(stageManager.transition);
            stageManager.transition = null;
            stageManager.currentWorldAsWorldObject.setActive(true);
            stageManager.currentWorldAsWorldObject.setVisible(true);
        });
    }
}