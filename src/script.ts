namespace Script {
    export type Function = () => IterableIterator<any>;
}

class Script {
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

    update() {
        if (!this.running) return;

        global.pushScript(this);

        let result = this.iterator.next();
        if (result.done) {
            this.done = true;
        }

        global.popScript();
    }

    finishImmediately(maxIters: number = Script.FINISH_IMMEDIATELY_MAX_ITERS) {
        let result = this.iterator.next();
        for (let i = 0; i < maxIters && !result.done; i++) {
            result = this.iterator.next();
        }
        this.done = true;
    }

    static FINISH_IMMEDIATELY_MAX_ITERS = 1000000;
}