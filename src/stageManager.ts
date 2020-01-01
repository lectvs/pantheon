class StageManager {
    stages: Dict<Stage>;

    currentStageName: string;
    currentWorld: World;

    private stageLoadQueue: { name: string, transition: Transition, entryPoint: Stage.EntryPoint };

    constructor(stages: Dict<Stage>) {
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
        let stageManager = this;

        Main.theater.runScript({
            generator: function* () {
                Main.theater.addWorldObject(transitionObj, { layer: Theater.LAYER_TRANSITION });
                while (!transitionObj.done) {
                    yield;
                }
            },
            endState: () => {
                Main.theater.removeWorldObject(transitionObj);
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
            Main.theater.removeWorldObject(this.currentWorld);
        }
        Main.theater.interactionManager.reset();

        // Create new stuff
        this.currentStageName = name;
        this.currentWorld = this.newWorldFromStage(stage);
        this.addPartyToWorld(Main.theater.party, Main.theater.currentWorld, stage, entryPoint);
        Main.theater.addWorldObject(this.currentWorld);
        Main.theater.setLayer(this.currentWorld, Theater.LAYER_WORLD);
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