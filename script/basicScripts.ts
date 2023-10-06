namespace S {
    // There is no async function. Use global.script.world.runScript(scriptFunction) instead.

    export function call(func: () => any): Script.Function {
        return function*() {
            func();
        }
    }

    export function callAfterTime(time: OrFactory<number>, func: () => any): Script.Function {
        return S.chain(S.wait(time), S.call(func));
    }

    export function chain(...scriptFunctions: Script.Function[]): Script.Function {
        return function*() {
            for (let scriptFunction of scriptFunctions) {
                yield scriptFunction;
            }
        }
    }

    export function doOverTime(time: OrFactory<number>, func: (t: number) => any): Script.Function {
        return function*() {
            let duration = OrFactory.resolve(time);
            if (duration < 0) {
                func(1);
                return;
            }
            let t = new Timer(duration);
            while (!t.done) {
                func(t.progress);
                t.update(global.script.delta);
                yield;
            }
            func(1);
        }
    }

    /**
     * Runs a list of script functions and stops when one of them ends.
     */
    export function either(...scriptFunctions: Script.Function[]): Script.Function {
        return function*() {
            let scripts: Script[] = scriptFunctions.map(sfn => new Script(sfn));
            if (A.isEmpty(scripts)) return;
            while (!scripts.some(s => s.done)) {
                for (let script of scripts) {
                    script.update(global.script.delta);
                }
                if (!scripts.some(s => s.done)) yield;
            }
        }
    }

    export function loopFor(count: number, scriptFunctionIter: (i: number) => Script.Function, yieldAfterLoop: boolean = false): Script.Function {
        return function*() {
            for (let i = 0; i < count; i++) {
                yield scriptFunctionIter(i);
                if (yieldAfterLoop) yield;
            }
        }
    }

    export function loopUntil(condition: () => any, scriptFunction: Script.Function): Script.Function {
        return function*() {
            while (!condition()) {
                yield scriptFunction;
            }
        }
    }

    export function noop(): Script.Function {
        return function*() {}
    }

    export function revealText(text: SpriteText, rate: number, sound?: string): Script.Function {
        return function*() {
            if (!global.world) return;
            text.visibleCharCount = 0;
            yield;
            while (!text.allCharactersVisible()) {
                text.visibleCharCount++;
                if (sound) global.world.playSound(sound);
                yield S.wait(1/rate);
            }
        }
    }

    export function schedule(...schedule: [number, Script.Function, ...Array<number | Script.Function>]): Script.Function {
        let fns: { t: number, s: Script.Function }[] = [];
        for (let i = 0; i < schedule.length; /* no incr */) {
            let t = schedule[i];
            let s = i+1 < schedule.length ? schedule[i+1] : S.noop();

            if (!M.isNumber(t)) {
                fns.push({ t: 0, s: t });
                i++;
            } else if (M.isNumber(s)) {
                fns.push({ t: t, s: S.noop() });
                i++;
            } else {
                fns.push({ t: t, s: s });
                i += 2;
            }
        }
        return S.simul(...fns.map(fn => S.chain(S.wait(fn.t), fn.s)));
    }

    export function setData(prop: string, value: any): Script.Function {
        return function*() {
            global.script.data[prop] = value;
        }
    }

    export function simul(...scriptFunctions: Script.Function[]): Script.Function {
        return function*() {
            let scripts: Script[] = scriptFunctions.map(sfn => new Script(sfn));
            while (!A.isEmpty(scripts)) {
                scripts = scripts.filter(script => {
                    script.update(global.script.delta);
                    return !script.done;
                });
                if (!A.isEmpty(scripts)) yield;
            }
        }
    }

    export function tween<T extends Partial<Record<K, number>>, K extends keyof T>(duration: OrFactory<number>, obj: T, prop: K, start: number, end: number, easingFunction: Tween.Easing.Function = Tween.Easing.Linear): Script.Function {
        return S.doOverTime(duration, t => {
            obj[prop] = M.lerp(t, start, end, easingFunction) as any;
        });
    }

    export function tweenPt(duration: OrFactory<number>, pt: Pt, start: Pt, end: Pt, easingFunction: Tween.Easing.Function = Tween.Easing.Linear): Script.Function {
        let startx = start.x;
        let starty = start.y;
        let endx = end.x;
        let endy = end.y;
        return S.simul(
            S.tween(duration, pt, 'x', startx, endx, easingFunction),
            S.tween(duration, pt, 'y', starty, endy, easingFunction),
        );
    }

    export function wait(time: OrFactory<number>): Script.Function {
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