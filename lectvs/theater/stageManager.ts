class StageManager {
    stages: Dict<Factory<World>>;

    currentStageName: string;
    currentWorld: World;
    currentWorldAsWorldObject: Theater.WorldAsWorldObject;

    private transition: Transition;
    get transitioning() { return !!this.transition; }

    private theater: Theater;

    constructor(theater: Theater, stages: Dict<Factory<World>>) {
        this.theater = theater;
        this.stages = stages;
        this.currentStageName = null;
        this.currentWorld = null;
        this.currentWorldAsWorldObject = null;
    }

    /**
     * Loads a stage immediately. If you are calling from inside your game, you probably want to call Theater.loadStage
     */
    internalLoadStage(name: string, transitionConfig: Transition.Config, entryPoint?: World.EntryPoint) {
        if (!this.stages[name]) {
            error(`Cannot load world '${name}' because it does not exist:`, this.stages);
            return;
        }

        if (!entryPoint) entryPoint = { x: this.theater.width/2, y: this.theater.height/2 };

        let oldSnapshot = this.currentWorld ? this.currentWorld.takeSnapshot() : Texture.filledRect(global.gameWidth, global.gameHeight, global.backgroundColor);

        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorldAsWorldObject);
        }
        this.theater.interactionManager.reset();

        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = this.stages[name]();
        this.currentWorldAsWorldObject = new Theater.WorldAsWorldObject(this.currentWorld);
        this.currentWorldAsWorldObject.name = 'world';
        this.currentWorldAsWorldObject.layer = Theater.LAYER_WORLD;
        this.theater.addWorldObject(this.currentWorldAsWorldObject);

        this.theater.onStageLoad();
        this.currentWorld.update();
        
        let newSnapshot = this.currentWorld.takeSnapshot();

        this.currentWorldAsWorldObject.active = false;
        this.currentWorldAsWorldObject.visible = false;

        // this is outside the script to avoid 1-frame flicker
        this.transition = Transition.fromConfigAndSnapshots(transitionConfig, oldSnapshot, newSnapshot);
        this.transition.layer = Theater.LAYER_TRANSITION;
        this.theater.addWorldObject(this.transition);

        let stageManager = this;
        this.theater.runScript(function* () {
            while (!stageManager.transition.done) {
                yield;
            }

            World.Actions.removeWorldObjectFromWorld(stageManager.transition);
            stageManager.transition = null;
            stageManager.currentWorldAsWorldObject.active = true;
            stageManager.currentWorldAsWorldObject.visible = true;
        });
    }
}