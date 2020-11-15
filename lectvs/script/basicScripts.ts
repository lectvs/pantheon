namespace S {
    // There is no async function. Use global.script.world.runScript(scriptFunction) instead.

    export function call(func: () => any): Script.Function {
        return function*() {
            func();
        }
    }

    export function callAfterTime(time: number, func: () => any): Script.Function {
        return S.chain(S.wait(time), S.call(func));
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

    export function loopFor(count: number, scriptFunction: Script.Function): Script.Function {
        return function*() {
            for (let i = 0; i < count; i++) {
                yield* scriptFunction();
            }
        }
    }

    export function loopUntil(condition: () => any, scriptFunction: Script.Function): Script.Function {
        return function*() {
            while (!condition()) {
                yield* scriptFunction();
            }
        }
    }

    export function noop(): Script.Function {
        return function*() {}
    }

    export function setData(prop: string, value: any): Script.Function {
        return function*() {
            global.script.data[prop] = value;
        }
    }

    export function simul(...scriptFunctions: Script.Function[]): Script.Function {
        return function*() {
            let scripts: Script[] = scriptFunctions.map(sfn => new Script(sfn));
            while (!_.isEmpty(scripts)) {
                scripts = scripts.filter(script => {
                    script.update(global.script.delta);
                    return !script.done;
                });
                if (!_.isEmpty(scripts)) yield;
            }
        }
    }

    export function tween<T extends Partial<Record<K, number>>, K extends keyof T>(duration: number, obj: T, prop: K, start: number, end: number, easingFunction: Tween.Easing.Function = Tween.Easing.Linear): Script.Function {
        return function*() {
            let tween = new Tween(start, end, duration, easingFunction);
            while (!tween.done) {
                tween.update(global.script.delta);
                obj[prop] = <any>tween.value;
                yield;
            }
            obj[prop] = <any>end;
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

    export function yield(): Script.Function {
        return function*() {
            yield;
        }
    }
}