/**
 * When removing a stage from the stageStack, make sure to add it to the wastebin!
 */
namespace StageManager {
    export type StageTransitionProps = {
        transition?: Transition;
        /**
         * @default - true iff either the old or the new stage is a Menu.
         */
        stackPrevious?: boolean;
        doNotPlayWorldMusic?: boolean;
        onBeginTransition?: (world: World) => void;
        onTransitioned?: (world: World) => void;
    }
}

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
    
    back(transition: Transition = new Transitions.Instant()) {
        if (this.stageStack.length === 0) return;

        let oldWorld = this.getCurrentWorld();
        this.addToWastebin(this.stageStack.pop()!.world);
        let newWorld = this.getCurrentWorld();
        this.transitionTo(oldWorld, newWorld, transition, false);
    }

    clearMenus(transition: Transition = new Transitions.Instant()) {
        let oldWorld = this.getCurrentWorld();
        this.stageStack.filterInPlace(stage => {
            if (stage.world instanceof Menu) {
                this.addToWastebin(stage.world);
                return false;
            }
            return true;
        });
        let newWorld = this.getCurrentWorld();

        if (oldWorld !== newWorld) {
            this.transitionTo(oldWorld, newWorld, transition, false);
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

    load(stage: () => World, props: StageManager.StageTransitionProps = { transition: undefined }) {
        this.endOfFrameQueue.push(() => this.loadImmediate(stage, props));
    }

    loadImmediate(stage: () => World, props: StageManager.StageTransitionProps = { transition: undefined }) {
        let oldWorld = this.getCurrentWorld();
        let newWorld = stage();
        if (props.onBeginTransition) {
            newWorld.addHook('onBeginTransition', function() {
                props.onBeginTransition!(this);
            }, { runOnce: true });
        }
        if (props.onTransitioned) {
            newWorld.addHook('onTransitioned', function() {
                props.onTransitioned!(this);
            }, { runOnce: true });
        }
        let stackPrevious = props.stackPrevious ?? (oldWorld instanceof Menu || newWorld instanceof Menu);
        if (!stackPrevious && this.stageStack.length > 0) {
            this.addToWastebin(this.stageStack.pop()!.world);
        }
        this.stageStack.push({
            world: newWorld,
            worldFactory: stage,
        });
        newWorld.update();
        this.transitionTo(oldWorld, newWorld, props.transition ?? new Transitions.Instant(), props.doNotPlayWorldMusic);
        return newWorld;
    }

    reload(props: StageManager.StageTransitionProps = { transition: undefined }) {
        this.endOfFrameQueue.push(() => this.reloadImmediate(props));
    }

    reloadImmediate(props: StageManager.StageTransitionProps = { transition: undefined }) {
        if (this.stageStack.length === 0) {
            console.error('Cannot reload current stage because there are no stages loaded');
            return;
        }
        if (props.stackPrevious !== undefined) {
            console.error('stackPrevious prop is not supported in reload/reloadImmediate');
        }
        props.stackPrevious = false;
        this.loadImmediate(this.stageStack.last()!.worldFactory, props);
    }

    reset() {
        this.stageStack.forEach(stage => this.addToWastebin(stage.world));
        this.stageStack.clear();
        this.transition = undefined;
        this.endOfFrameQueue.clear();
    }

    private transitionTo(oldWorld: World | undefined, newWorld: World | undefined, transition: Transition, doNotPlayWorldMusic: boolean | undefined) {
        this.transition = transition;
        this.transition.setData({ oldWorld, newWorld, doNotPlayWorldMusic });
        newWorld?.onBeginTransition();
        if (newWorld?.music.action === 'playontransitionbegin' && !doNotPlayWorldMusic) {
            global.game.musicManager.play(newWorld.music.music, newWorld.music.fadeTime);
        }
        if (this.transition.done) {
            this.finishTransition();
        }
        this.garbageCollect();
        FrameCache.clear();
    }

    private finishTransition() {
        let world = this.getCurrentWorld();
        if (world?.music.action === 'playontransitionend' && !this.transition?.doNotPlayWorldMusic) {
            global.game.musicManager.play(world.music.music, world.music.fadeTime);
        }
        if (this.transition) {
            this.transition.free();
            this.transition = undefined;
        }
        world?.onTransitioned();
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