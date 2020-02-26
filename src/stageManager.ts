class StageManager {
    stages: Dict<Stage>;

    currentStageName: string;
    currentWorld: World;

    private transition: Transition;
    get transitioning() { return !!this.transition; }

    private theater: Theater;
    private stageLoadQueue: { name: string, transitionConfig: Transition.Config, entryPoint: Stage.EntryPoint };

    constructor(theater: Theater, stages: Dict<Stage>) {
        this.theater = theater;
        this.stages = stages;
        this.currentStageName = null;
        this.currentWorld = null;
        this.stageLoadQueue = null;
    }

    loadStage(name: string, transitionConfig: Transition.Config, entryPoint: Stage.EntryPoint) {
        if (!this.stages[name]) {
            debug(`Cannot load stage '${name}' because it does not exist:`, this.stages);
            return;
        }
        if (!this.currentStageName) {
            if (transitionConfig.type !== 'instant') debug(`Ignoring transition ${transitionConfig.type} for stage ${name} because no other stage is loaded`);
            this.setStage(name, entryPoint);
        }
        this.stageLoadQueue = { name, transitionConfig, entryPoint };
    }

    loadStageIfQueued() {
        if (!this.stageLoadQueue) return;

        let name = this.stageLoadQueue.name;
        let transitionConfig = this.stageLoadQueue.transitionConfig;
        let entryPoint = this.stageLoadQueue.entryPoint;
        this.stageLoadQueue = null;

        let oldWorld = this.currentWorld;
        let oldSnapshot = oldWorld.takeSnapshot();

        this.setStage(name, entryPoint);
        this.currentWorld.update(0);
        
        let newSnapshot = this.currentWorld.takeSnapshot();

        this.currentWorld.active = false;
        this.currentWorld.visible = false;

        // this is outside the script to avoid 1-frame flicker
        this.transition = Transition.fromConfigAndSnapshots(transitionConfig, oldSnapshot, newSnapshot);
        World.Actions.setLayer(this.transition, Theater.LAYER_TRANSITION);
        World.Actions.addWorldObjectToWorld(this.transition, this.theater);

        let stageManager = this;
        this.theater.runScript(function* () {
            while (!stageManager.transition.done) {
                yield;
            }

            World.Actions.removeWorldObjectFromWorld(stageManager.transition);
            stageManager.transition = null;
            stageManager.currentWorld.active = true;
            stageManager.currentWorld.visible = true;
        });
    }

    private setStage(name: string, entryPoint: Stage.EntryPoint) {
        let stage = Stage.resolveConfig(this.stages[name]);

        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorld);
        }
        this.theater.interactionManager.reset();

        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = this.newWorldFromStage(stage);
        this.addPartyToWorld(this.theater.currentWorld, name, entryPoint);
        World.Actions.setLayer(this.currentWorld, Theater.LAYER_WORLD);
        World.Actions.addWorldObjectToWorld(this.currentWorld, this.theater);

        this.theater.onStageLoad();
    }

    private addPartyToWorld(world: World, stageName: string, entryPoint: Stage.EntryPoint) {
        // Resolve entry point.
        if (_.isString(entryPoint)) {
            entryPoint = Stage.getEntryPoint(this.stages[stageName], entryPoint);
        }
        this.theater.partyManager.addMembersToWorld(world, stageName, entryPoint);
    }

    private newWorldFromStage(stage: Stage) {
        let world = new World(stage);

        if (stage.worldObjects) {
            for (let worldObjectConfig of stage.worldObjects) {
                let worldObject = WorldObject.fromConfig(worldObjectConfig);
                World.Actions.addWorldObjectToWorld(worldObject, world);
            }
        }

        return world;
    }
}