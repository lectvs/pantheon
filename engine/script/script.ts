namespace Script {
    export type Function = () => IterableIterator<FunctionInner | number | undefined>;
    type FunctionInner = Script.Function | Script.Function[] | undefined;
}

class Script {
    iterator: IterableIterator<any>;
    name?: string;

    paused: boolean;
    isDone: boolean;

    // Global data for use in scripts
    delta: number;
    data: any;

    constructor(scriptFunction: Script.Function, name?: string) {
        this.iterator = this.buildIterator(scriptFunction)();
        this.name = name;
        this.paused = false;
        this.isDone = false;
        this.delta = 0;
        this.data = {};
    }

    get running() {
        return !this.paused && !this.isDone;
    }

    update(delta: number) {
        if (!this.running) return;

        global.pushScript(this);
        this.delta = delta;

        let result = this.iterator.next();
        if (result.done) {
            this.isDone = true;
        }

        global.popScript();
    }

    finishImmediately(maxIters: number = Script.FINISH_IMMEDIATELY_MAX_ITERS) {
        for (let i = 0; i < maxIters && !this.isDone; i++) {
            this.update(0.1);
        }
        
        if (!this.isDone) {
            console.error('Warning: script finishImmediately exceeded max iters!', this);
            this.isDone = true;
        }
    }

    stop() {
        this.isDone = true;
    }

    private buildIterator(scriptFunction: Script.Function) {
        let s = this;
        return function*() {
            let iterator = scriptFunction();

            while (true) {
                let result = iterator.next();
                if (result.value) {
                    if (M.isNumber(result.value)) {
                        result.value = S.wait(result.value);
                    } else if (Array.isArray(result.value)) {
                        result.value = S.simul(...result.value.map(scr => M.isNumber(scr) ? S.wait(scr) : s.buildIterator(scr)));
                    }
                    let script = new Script(result.value);
                    while (!script.isDone) {
                        script.update(global.script.delta);
                        if (script.isDone) break;
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