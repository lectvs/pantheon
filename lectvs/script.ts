namespace Script {
    export type Function = () => IterableIterator<any>;
}

class Script {
    iterator: IterableIterator<any>;

    paused: boolean;
    done: boolean;

    // Global data for use in scripts
    world: World;
    worldObject: WorldObject;
    theater: Theater;
    delta: number;
    data: any;

    constructor(scriptFunction: Script.Function) {
        this.iterator = scriptFunction();
        this.data = {};
    }

    get running() {
        return !this.paused && !this.done;
    }

    update(world: World, worldObject: WorldObject, delta: number) {
        if (!this.running) return;

        global.pushScript(this);
        this.world = world;
        this.worldObject = worldObject;
        this.theater = global.theater;
        this.delta = delta

        let result = this.iterator.next();
        if (result.done) {
            this.done = true;
        }

        global.popScript();
    }

    finishImmediately(world: World, worldObject: WorldObject, maxIters: number = Script.FINISH_IMMEDIATELY_MAX_ITERS) {
        for (let i = 0; i < maxIters && !this.done; i++) {
            this.update(world, worldObject, 0.01);
        }
        this.done = true;
    }

    static FINISH_IMMEDIATELY_MAX_ITERS = 1000000;
}