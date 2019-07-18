namespace S {
    export function chain(...scriptFunctions: Script.Function[]) {
        let i = 0;
        return {
            generator: function*() {
                while (i < scriptFunctions.length) {
                    yield* runScript(scriptFunctions[i]);
                    i++;
                }
            },
            endState: () => {
                while (i < scriptFunctions.length) {
                    if (scriptFunctions[i].endState) scriptFunctions[i].endState();
                    i++;
                }
            }
        }
    }

    export function doOverTime(time: number, func: (t: number) => any): Script.Function {
        return {
            generator: function*() {
                let t = new Timer(time);
                while (!t.done) {
                    func(t.progress);
                    t.update(S.global.delta);
                    yield;
                }
            }, endState: () => func(1),
        }
    }

    export function finishImmediately(scriptFunction: Script.Function, maxIters: number = Script.FINISH_IMMEDIATELY_MAX_ITERS) {
        let script = new Script(scriptFunction);
        script.finishImmediately(maxIters);
    }

    export function runScript(scriptFunction: Script.Function): IterableIterator<any> {
        return function*() {
            let script = S.global.world.runScript(scriptFunction);
            while (!script.done) {
                yield;
            }
        }();
    }

    export function wait(time: number): Script.Function {
        return {
            generator: doOverTime(time, t => null).generator,
        }
    }
}