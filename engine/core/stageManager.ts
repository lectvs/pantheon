class StageManager {
    private stageStack: {
        world: World;
        worldFactory: () => World;
    }[];
    private transition: Transition | undefined;

    get delta() { return global.game.delta; }

    constructor() {
        this.stageStack = [];
    }

    update() {
        if (this.transition) {
            this.transition.update(this.delta);
            if (this.transition.done) {
                this.finishTransition();
            }
        } else {
            this.getCurrentWorld()?.update();
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
        this.stageStack.filterInPlace(stage => !(stage.world instanceof Menu));
        let newWorld = this.getCurrentWorld();

        if (oldWorld !== newWorld) {
            this.transitionTo(oldWorld, newWorld, transition);
        }
    }

    getCurrentWorld() {
        return this.stageStack.last()?.world;
    }

    isInMenu() {
        return this.getCurrentWorld() instanceof Menu;
    }

    internalLoadStage(stage: () => World, transition: Transition) {
        let oldWorld = this.getCurrentWorld();
        let newWorld = stage();
        this.stageStack.push({
            world: newWorld,
            worldFactory: stage,
        });
        newWorld.update();
        this.transitionTo(oldWorld, newWorld, transition);
        return newWorld;
    }

    internalReloadCurrentStage(transition: Transition) {
        if (this.stageStack.length === 0) {
            console.error('Cannot reload current stage because there are no stages loaded');
            return;
        }
        this.internalLoadStage(this.stageStack.last()!.worldFactory, transition);
    }

    reset() {
        this.stageStack.clear();
        this.transition = undefined;
    }

    transitionTo(oldWorld: World | undefined, newWorld: World | undefined, transition: Transition) {
        this.transition = transition;
        this.transition.setData(oldWorld, newWorld);
        if (this.transition.done) {
            this.finishTransition();
        }
    }

    private finishTransition() {
        if (this.transition) {
            this.transition.free();
            this.transition = undefined;
        }

        this.getCurrentWorld()?.onTransitioned();
    }
}