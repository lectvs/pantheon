class WorldManager {
    worlds: Dict<World.Config>;

    currentWorldName: string;
    currentWorld: World;

    private transition: Transition;
    get transitioning() { return !!this.transition; }

    private theater: Theater;
    private stageLoadQueue: { name: string, transitionConfig: Transition.Config, entryPoint: World.EntryPoint };

    constructor(theater: Theater, worlds: Dict<World.Config>) {
        this.theater = theater;
        this.worlds = worlds;
        this.currentWorldName = null;
        this.currentWorld = null;
        this.stageLoadQueue = null;
    }

    loadStage(name: string, transitionConfig: Transition.Config, entryPoint?: World.EntryPoint) {
        if (!this.worlds[name]) {
            debug(`Cannot load world '${name}' because it does not exist:`, this.worlds);
            return;
        }
        if (!entryPoint) entryPoint = { x: this.theater.width/2, y: this.theater.height/2 };
        if (!this.currentWorldName) {
            if (transitionConfig.type !== 'instant') debug(`Ignoring transition ${transitionConfig.type} for world ${name} because no other world is loaded`);
            this.setWorld(name, entryPoint);
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

        this.setWorld(name, entryPoint);
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

    private setWorld(name: string, entryPoint: World.EntryPoint) {
        // Remove old stuff
        if (this.currentWorld) {
            World.Actions.removeWorldObjectFromWorld(this.currentWorld);
        }
        this.theater.interactionManager.reset();

        // Create new stuff
        this.currentWorldName = name;
        this.currentWorld = WorldObject.fromConfig<World>(this.worlds[name]);
        this.addPartyToWorld(this.currentWorld, name, entryPoint);
        World.Actions.setLayer(this.currentWorld, Theater.LAYER_WORLD);
        World.Actions.addWorldObjectToWorld(this.currentWorld, this.theater);

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