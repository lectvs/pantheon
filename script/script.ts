namespace Script {
    export type Function = () => IterableIterator<FunctionInner>;
    type FunctionInner = Script.Function | (() => IterableIterator<FunctionInner>)[];
}

class Script {
    iterator: IterableIterator<any>;
    name: string;

    paused: boolean;
    done: boolean;

    // Global data for use in scripts
    delta: number;
    data: any;

    constructor(scriptFunction: Script.Function, name?: string) {
        this.iterator = this.buildIterator(scriptFunction)();
        this.name = name;
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
            console.error('Warning: script finishImmediately exceeded max iters!', this);
            this.done = true;
        }
    }

    stop() {
        this.done = true;
    }

    private buildIterator(scriptFunction: Script.Function) {
        let s = this;
        return function*() {
            let iterator = scriptFunction();

            while (true) {
                let result = iterator.next();
                if (result.value) {
                    if (_.isArray(result.value)) {
                        result.value = S.simul(...result.value.map(scr => s.buildIterator(scr)));
                    }
                    let script = new Script(result.value);
                    while (!script.done) {
                        script.update(global.script.delta);
                        if (script.done) break;
                        yield;
                    }
                } else if (!result.done) {  // Normal yield statement.
                    yield;
                }
                if (result.done) break;
            }
        };
    }

    static FINISH_IMMEDIATELY_MAX_ITERS = 1000000;
}

namespace Script {
    export function instant(scriptFunction: Script.Function, maxIters?: number) {
        new Script(scriptFunction).finishImmediately(maxIters);
    }
}