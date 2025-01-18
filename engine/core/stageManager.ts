class StageManager {
    private stageStack: {
        world: World;
        worldFactory: () => World;
    }[];
    private transition: Transition | undefined;

    private endOfFrameQueue: (() => any)[];

    private wastebin: {
        worldToUnload: World;
        garbageCollectionCyclesLeft: number;
    }[];

    constructor() {
        this.stageStack = [];
        this.endOfFrameQueue = [];
        this.wastebin = [];
    }

    update() {
        if (this.transition) {
            this.transition.update(Main.delta);
            if (this.transition.done) {
                this.finishTransition();
            }
        } else {
            this.getCurrentWorld()?.update();
        }

        while (!A.isEmpty(this.endOfFrameQueue)) {
            this.endOfFrameQueue.shift()!();
        }
    }

    render() {
        if (this.transition) {
            return this.transition.render();
        }
        let currentWorld = this.getCurrentWorld();
        if (currentWorld) {
            return currentWorld.render();
        }
        return FrameCache.array();
    }
    
    back(transition: Transition) {
        if (this.stageStack.length === 0) return;

        let oldWorld = this.getCurrentWorld();
        this.stageStack.pop();
        let newWorld = this.getCurrentWorld();
        this.transitionTo(oldWorld, newWorld, transition);
    }

    clearMenus(transition: Transition) {
        let oldWorld = this.getCurrentWorld();
        this.stageStack.filterInPlace(stage => {
            if (stage.world instanceof Menu) {
                if (stage.world !== oldWorld) {
                    stage.world.unload();
                }
                return false;
            }
            return true;
        });
        let newWorld = this.getCurrentWorld();

        if (oldWorld !== newWorld) {
            this.transitionTo(oldWorld, newWorld, transition);
        }
    }

    getCurrentGameWorld() {
        return this.stageStack.findLast(world => !(world.world instanceof Menu))?.world;
    }

    getCurrentMenuWorld() {
        return this.stageStack.findLast(world => world.world instanceof Menu)?.world;
    }

    getCurrentWorld() {
        return this.stageStack.last()?.world;
    }

    isInMenu() {
        return this.getCurrentWorld() instanceof Menu;
    }

    /**
     * If stackPrevious is undefined, will be true iff either old or new stage is a Menu.
     */
    load(stage: () => World, transition: Transition = new Transitions.Instant(), stackPrevious?: boolean) {
        this.endOfFrameQueue.push(() => this.loadImmediate(stage, transition, stackPrevious));
    }

    /**
     * If stackPrevious is undefined, will be true iff either old or new stage is a Menu.
     */
    loadImmediate(stage: () => World, transition: Transition = new Transitions.Instant(), stackPrevious?: boolean) {
        let oldWorld = this.getCurrentWorld();
        let newWorld = stage();
        if (stackPrevious === undefined) {
            stackPrevious = oldWorld instanceof Menu || newWorld instanceof Menu;
        }
        if (!stackPrevious) {
            this.stageStack.pop();
        }
        this.stageStack.push({
            world: newWorld,
            worldFactory: stage,
        });
        newWorld.update();
        this.transitionTo(oldWorld, newWorld, transition);
        return newWorld;
    }

    reload(transition: Transition = new Transitions.Instant()) {
        this.endOfFrameQueue.push(() => this.reloadImmediate(transition));
    }

    reloadImmediate(transition: Transition = new Transitions.Instant()) {
        if (this.stageStack.length === 0) {
            console.error('Cannot reload current stage because there are no stages loaded');
            return;
        }
        this.loadImmediate(this.stageStack.last()!.worldFactory, transition, false);
    }

    reset() {
        this.stageStack.forEach(stage => stage.world.unload());
        this.stageStack.clear();
        this.transition = undefined;
    }

    transitionTo(oldWorld: World | undefined, newWorld: World | undefined, transition: Transition) {
        this.transition = transition;
        this.transition.setData(oldWorld, newWorld);
        newWorld?.onBeginTransition();
        if (this.transition.done) {
            this.finishTransition();
        }
        if (oldWorld && !this.isWorldOnStageStack(oldWorld)) {
            oldWorld.unload();
            this.addToWastebin(oldWorld);
        }
        this.garbageCollect();
    }

    private finishTransition() {
        if (this.transition) {
            this.transition.free();
            this.transition = undefined;
        }

        this.getCurrentWorld()?.onTransitioned();
    }

    private isWorldOnStageStack(world: World) {
        return this.stageStack.some(stage => stage.world === world);
    }

    private addToWastebin(world: World) {
        let existingEntry = this.wastebin.find(entry => entry.worldToUnload === world);
        if (existingEntry) {
            existingEntry.garbageCollectionCyclesLeft = 4;
            return;
        }
        this.wastebin.push({
            worldToUnload: world,
            garbageCollectionCyclesLeft: 4,
        });
    }

    private garbageCollect() {
        this.wastebin.filterInPlace(entry => {
            entry.garbageCollectionCyclesLeft--;
            if (entry.garbageCollectionCyclesLeft <= 0) {
                if (!this.isWorldOnStageStack(entry.worldToUnload)) {
                    entry.worldToUnload.unload();
                }
                return false;
            }
            return true;
        });
    }
}