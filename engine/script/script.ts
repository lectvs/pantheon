namespace Script {
    export type Function = () => IterableIterator<FunctionLike>;
    export type FunctionLike = Script.Function | Script | number | undefined | FunctionLike[];
}

class Script {
    iterator: IterableIterator<any>;
    name?: string;

    paused: boolean;
    isDone: boolean;

    // Global data for use in scripts
    delta: number;
    data: any;

    constructor(scriptFunctionLike: Script.FunctionLike, name?: string) {
        this.iterator = Script.toScriptFunction(scriptFunctionLike)();
        this.name = name;
        this.paused = false;
        this.isDone = false;
        this.delta = 0;
        this.data = {};

        if (scriptFunctionLike instanceof Script && scriptFunctionLike.isDone) {
            this.isDone = true;
        }
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
        
        return this;
    }

    runManually() {
        this.stop();
        return () => this.iterator;
    }

    skipTime(time: number) {
        while (time >= 0.1) {
            this.update(0.1);
            time -= 0.1;
        }
        if (time > 0){
            this.update(time);
        }
        return this;
    }

    stop() {
        this.isDone = true;
    }

    static FINISH_IMMEDIATELY_MAX_ITERS = 1000000;
}

namespace Script {
    export function noop() {
        return instant(function*() {});
    }

    export function instant(scriptFunction: Script.Function, maxIters?: number) {
        return new Script(scriptFunction).finishImmediately(maxIters);
    }

    export function toScriptFunction(functionLike: FunctionLike): Script.Function {
        if (!functionLike) {
            return S.noop();
        }

        if (M.isNumber(functionLike)) {
            return S.wait(functionLike);
        }
        
        if (functionLike instanceof Script) {
            let waitForScript = functionLike;
            return S.waitUntil(() => waitForScript.isDone);
        }
        
        if (Array.isArray(functionLike)) {
            return S.simul(...functionLike.map(scr => toScriptFunction(scr)));
        }

        return buildIterator(functionLike);
    }

    function buildIterator(scriptFunction: Script.Function) {
        return function*() {
            let iterator = scriptFunction();

            while (true) {
                let result = iterator.next();
                if (result.value) {
                    result.value = toScriptFunction(result.value);

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
}