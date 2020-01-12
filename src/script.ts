namespace Script {
    export type Function = () => IterableIterator<any>;
}

class Script {
    world: World;
    theater: Theater;
    iterator: IterableIterator<any>;
    data: any;

    paused: boolean;
    done: boolean;

    constructor(scriptFunction: Script.Function) {
        this.iterator = scriptFunction();
        this.data = {};
    }

    get running() {
        return !this.paused && !this.done;
    }

    update(world: World) {
        if (!this.running) return;

        global.pushScript(this);
        this.world = world;
        this.theater = global.theater;

        let result = this.iterator.next();
        if (result.done) {
            this.done = true;
        }

        global.popScript();
    }

    finishImmediately(world: World, maxIters: number = Script.FINISH_IMMEDIATELY_MAX_ITERS) {
        for (let i = 0; i < maxIters && !this.done; i++) {
            this.update(world);
        }
        this.done = true;
    }

    static FINISH_IMMEDIATELY_MAX_ITERS = 1000000;
}