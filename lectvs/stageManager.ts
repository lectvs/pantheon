class StageManager {
    stages: Dict<World.Config>;

    currentStageName: string;
    currentWorld: World;
    currentWorldAsWorldObject: World.WorldAsWorldObject;

    private transition: Transition;
    get transitioning() { return !!this.transition; }

    private theater: Theater;
    private stageLoadQueue: { name: string, transitionConfig: Transition.Config, entryPoint: World.EntryPoint };

    constructor(theater: Theater, stages: Dict<World.Config>) {
        this.theater = theater;
        this.stages = stages;
        this.currentStageName = null;
        this.currentWorld = null;
        this.currentWorldAsWorldObject = null;
        this.stageLoadQueue = null;
    }

    loadStage(name: string, transitionConfig: Transition.Config, entryPoint?: World.EntryPoint) {
        if (!this.stages[name]) {
            debug(`Cannot load world '${name}' because it does not exist:`, this.stages);
            return;
        }
        if (!entryPoint) entryPoint = { x: this.theater.width/2, y: this.theater.height/2 };
        if (!this.currentStageName) {
            if (transitionConfig.type !== 'instant') debug(`Ignoring transition ${transitionConfig.type} for world ${name} because no other world is loaded`);
            this.setStage(name, entryPoint);
            return;
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

        this.currentWorldAsWorldObject.active = false;
        this.currentWorldAsWorldObject.visible = false;

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
            stageManager.currentWorldAsWorldObject.active = true;
            stageManager.currentWorldAsWorldObject.visible = true;
        });
    }

    private setStage(name: string, entryPoint: World.EntryPoint) {
        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorldAsWorldObject);
        }
        this.theater.interactionManager.reset();

        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = World.fromConfig<World>(this.stages[name]);
        this.currentWorldAsWorldObject = new World.WorldAsWorldObject(this.currentWorld);
        this.addPartyToWorld(this.currentWorld, name, entryPoint);
        World.Actions.setLayer(this.currentWorldAsWorldObject, Theater.LAYER_WORLD);
        World.Actions.addWorldObjectToWorld(this.currentWorldAsWorldObject, this.theater);

        this.theater.onStageLoad();
    }

    private addPartyToWorld(world: World, stageName: string, entryPoint: World.EntryPoint) {
        // Resolve entry point.
        if (_.isString(entryPoint)) {
            entryPoint = world.getEntryPoint(entryPoint);
        }
        this.theater.partyManager.addMembersToWorld(world, stageName, entryPoint);
    }
}