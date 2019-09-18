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
                    t.update();
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
            let script = global.world.runScript(scriptFunction);
            while (!script.done) {
                yield;
            }
        }();
    }

    export function simul(...scriptFunctions: Script.Function[]) {
        let scripts: Script[] = [];
        return {
            generator: function*() {
                scripts = scriptFunctions.map(sfn => global.world.runScript(sfn));
                while (!_.isEmpty(scripts)) {
                    for (let i = scripts.length-1; i >= 0; i--) {
                        if (scripts[i].done) scripts.splice(i, 1);
                    }
                    yield;
                }
            },
            endState: () => {
                if (!_.isEmpty(scripts)) {
                    for (let script of scripts) {
                        script.endState();
                    }
                }
            }
        }
    }

    export function tween(obj: any, prop: string, start: number, end: number, duration: number, easingFunction: Tween.Easing.Function = Tween.Easing.Linear) {
        return {
            generator: function*() {
                let tween = new Tween(start, end, duration, easingFunction);
                while (!tween.done) {
                    tween.update();
                    obj[prop] = tween.value;
                    yield;
                }
            },
            endState: () => {
                obj[prop] = end;
            }
        }
    }

    export function wait(time: number): Script.Function {
        return {
            generator: doOverTime(time, t => null).generator,
        }
    }
}