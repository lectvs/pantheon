class StageManager {
    stages: Dict<Stage>;

    currentStageName: string;
    currentWorld: World;

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
        this.currentWorld.update(this.theater, 0.01);
        
        let newSnapshot = this.currentWorld.takeSnapshot();

        this.currentWorld.active = false;
        this.currentWorld.visible = false;

        // this is outside the script to avoid 1-frame flicker
        let transition = Transition.fromConfigAndSnapshots(transitionConfig, oldSnapshot, newSnapshot);
        World.Actions.setLayer(transition, Theater.LAYER_TRANSITION);
        World.Actions.addWorldObjectToWorld(transition, this.theater);

        let stageManager = this;
        this.theater.runScript(function* () {
            while (!transition.done) {
                yield;
            }

            World.Actions.removeWorldObjectFromWorld(transition)
            stageManager.currentWorld.active = true;
            stageManager.currentWorld.visible = true;

            stageManager.theater.onStageLoad();
        });
    }

    setStage(name: string, entryPoint: Stage.EntryPoint) {
        if (!this.stages[name]) {
            debug(`Stage '${name}' does not exist in world.`);
            return;
        }

        let stage = Stage.resolveConfig(this.stages[name]);

        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorld);
        }
        this.theater.interactionManager.reset();

        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = this.newWorldFromStage(stage);
        this.addPartyToWorld(this.theater.party, this.theater.currentWorld, stage, entryPoint);
        World.Actions.setLayer(this.currentWorld, Theater.LAYER_WORLD);
        World.Actions.addWorldObjectToWorld(this.currentWorld, this.theater);
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

    private addPartyToWorld(party: Party, world: World, stage: Stage, entryPoint: Stage.EntryPoint) {
        // Resolve entry point.
        if (_.isString(entryPoint)) {
            entryPoint = Stage.getEntryPoint(stage, entryPoint);
        }
        for (let member of party.activeMembers) {
            party.addMemberToWorld(member, world);
            let memberObj = party.members[member].worldObject;
            memberObj.x = entryPoint.x;
            memberObj.y = entryPoint.y;
        }
    }
}