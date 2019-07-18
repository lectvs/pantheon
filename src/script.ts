namespace Script {
    export type Function = {
        generator: () => IterableIterator<any>;
        endState?: () => any;
        skippable?: boolean;
    }
}

class Script {
    generator: IterableIterator<any>;
    endState: () => any;
    skippable: boolean;

    paused: boolean;
    done: boolean;

    constructor(scriptFunction: Script.Function) {
        this.generator = scriptFunction.generator();
        this.endState = scriptFunction.endState;
        this.skippable = O.getOrDefault(scriptFunction.skippable, true);
    }

    get running() {
        return !this.paused && !this.done;
    }

    update() {
        if (!this.running) return;

        global.pushScript(this);

        let result = this.generator.next();
        if (result.done) {
            if (this.endState) this.endState();
            this.done = true;
        }

        global.popScript();
    }

    finishImmediately(maxIters: number = Script.FINISH_IMMEDIATELY_MAX_ITERS) {
        let result = this.generator.next();
        for (let i = 0; i < maxIters && !result.done; i++) {
            result = this.generator.next();
        }
        if (this.endState) this.endState();
        this.done = true;
    }

    static FINISH_IMMEDIATELY_MAX_ITERS = 1000000;
}