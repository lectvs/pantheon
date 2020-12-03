namespace Script {
    export type Function = () => IterableIterator<any>;
}

class Script {
    iterator: IterableIterator<any>;

    paused: boolean;
    done: boolean;

    // Global data for use in scripts
    delta: number;
    data: any;

    constructor(scriptFunction: Script.Function) {
        this.iterator = scriptFunction();
        this.data = {};
    }

    get running() {
        return !this.paused && !this.done;
    }

    update(delta: number) {
        if (!this.running) return;

        global.pushScript(this);
        this.delta = delta;

        let result = this.iterator.next();
        if (result.done) {
            this.done = true;
        }

        global.popScript();
    }

    finishImmediately(maxIters: number = Script.FINISH_IMMEDIATELY_MAX_ITERS) {
        for (let i = 0; i < maxIters && !this.done; i++) {
            this.update(0.1);
        }
        
        if (!this.done) {
            error('Warning: script finishImmediately exceeded max iters!', this);
            this.done = true;
        }
    }

    stop() {
        this.done = true;
    }

    static FINISH_IMMEDIATELY_MAX_ITERS = 1000000;
}

namespace Script {
    export function instant(scriptFunction: Script.Function, maxIters?: number) {
        new Script(scriptFunction).finishImmediately(maxIters);
    }
}