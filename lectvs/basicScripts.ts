namespace S {
    // There is no async function. Use global.script.world.runScript(scriptFunction) instead.

    export function call(func: () => any): Script.Function {
        return function*() {
            func();
        }
    }

    export function chain(...scriptFunctions: Script.Function[]): Script.Function {
        return function*() {
            for (let scriptFunction of scriptFunctions) {
                yield* scriptFunction();
            }
        }
    }

    export function doOverTime(time: number, func: (t: number) => any): Script.Function {
        return function*() {
            let t = new Timer(time);
            while (!t.done) {
                func(t.progress);
                t.update(global.script.delta);
                yield;
            }
            func(1);
        }
    }

    export function loopFor(count: number, scriptFunction: Script.Function) {
        return function*() {
            for (let i = 0; i < count; i++) {
                yield* scriptFunction();
            }
        }
    }

    export function loopUntil(condition: () => any, scriptFunction: Script.Function) {
        return function*() {
            while (!condition()) {
                yield* scriptFunction();
            }
        }
    }

    export function simul(...scriptFunctions: Script.Function[]): Script.Function {
        return function*() {
            let scripts: Script[] = scriptFunctions.map(sfn => global.script.world.runScript(sfn));
            while (!_.isEmpty(scripts)) {
                scripts = scripts.filter(script => !script.done);
                yield;
            }
        }
    }

    export function tween(obj: any, prop: string, start: number, end: number, duration: number, easingFunction: Tween.Easing.Function = Tween.Easing.Linear): Script.Function {
        return function*() {
            let tween = new Tween(start, end, duration, easingFunction);
            while (!tween.done) {
                tween.update(global.script.delta);
                obj[prop] = tween.value;
                yield;
            }
            obj[prop] = end;
        }
    }

    export function wait(time: number): Script.Function {
        return doOverTime(time, t => null);
    }

    export function waitUntil(condition: () => any): Script.Function {
        return function*() {
            while (!condition()) {
                yield;
            }
        }
    }
}