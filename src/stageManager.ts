class StageManager {
    stages: Dict<Stage>;

    currentStageName: string;
    currentWorld: World;

    private theater: Theater;
    private stageLoadQueue: { name: string, transition: Transition, entryPoint: Stage.EntryPoint };

    constructor(theater: Theater, stages: Dict<Stage>) {
        this.theater = theater;
        this.stages = stages;
        this.currentStageName = null;
        this.currentWorld = null;
        this.stageLoadQueue = null;
    }

    loadStage(name: string, transition: Transition, entryPoint: Stage.EntryPoint) {
        this.stageLoadQueue = { name, transition, entryPoint };
    }

    loadStageIfQueued() {
        if (!this.stageLoadQueue) return;

        let name = this.stageLoadQueue.name;
        let transition = this.stageLoadQueue.transition;
        let entryPoint = this.stageLoadQueue.entryPoint;
        this.stageLoadQueue = null;

        let oldWorld = this.currentWorld;
        let oldSnapshot = oldWorld.takeSnapshot();

        this.setStage(name, entryPoint);
        this.currentWorld.update();
        
        let newSnapshot = this.currentWorld.takeSnapshot();

        this.currentWorld.active = false;
        this.currentWorld.visible = false;

        let transitionObj = new Transition.Obj(oldSnapshot, newSnapshot, transition);
        this.theater.addWorldObject(transitionObj, { layer: Theater.LAYER_TRANSITION });

        let stageManager = this;
        this.theater.runScript({
            generator: function* () {
                while (!transitionObj.done) {
                    yield;
                }
                stageManager.theater.removeWorldObject(transitionObj);
                stageManager.currentWorld.active = true;
                stageManager.currentWorld.visible = true;
            }
        });
    }

    setStage(name: string, entryPoint: Stage.EntryPoint) {
        if (!this.stages[name]) {
            debug(`Stage '${name}' does not exist in world.`);
            return;
        }

        let stage = Stage.resolveStageConfig(this.stages[name]);

        // Remove old stuff
        if (this.currentWorld) {
            this.theater.removeWorldObject(this.currentWorld);
        }
        this.theater.interactionManager.reset();

        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = this.newWorldFromStage(stage);
        this.addPartyToWorld(this.theater.party, this.theater.currentWorld, stage, entryPoint);
        this.theater.addWorldObject(this.currentWorld);
        this.theater.setLayer(this.currentWorld, Theater.LAYER_WORLD);
    }

    private newWorldFromStage(stage: Stage) {
        let world = new World(stage);

        if (stage.worldObjects) {
            for (let worldObject of stage.worldObjects) {
                this.addWorldObjectFromStageConfig(world, worldObject);
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
            let memberObj = party.addMemberToWorld(member, world);
            memberObj.x = entryPoint.x;
            memberObj.y = entryPoint.y;
        }
    }

    private addWorldObjectFromStageConfig(world: World, worldObject: SomeStageConfig) {
        worldObject = Stage.resolveWorldObjectConfig(worldObject);
        if (!worldObject.constructor) return null;

        let config = <AllStageConfig> worldObject;
        _.defaults(config, {
            layer: World.DEFAULT_LAYER,
        });

        let obj: WorldObject = new config.constructor(config);
        world.addWorldObject(obj, {
            name: config.name,
            layer: config.layer,
            physicsGroup: config.physicsGroup,
        });

        return obj;
    }
}