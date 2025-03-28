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

    export function chain(...scriptFunctions: Script.FunctionLike[]): Script.Function {
        return function*() {
            for (let scriptFunction of scriptFunctions) {
                yield scriptFunction;
            }
        }
    }

    export function doOverTime(time: OrFactory<number>, func: (t: number, time: number) => any): Script.Function {
        return function*() {
            let duration = OrFactory.resolve(time);
            if (duration <= 0) {
                func(1, 0);
                return;
            }
            let t = new Timer(duration);
            while (!t.isDone) {
                func(t.progress, t.time);
                t.update(global.script.delta);
                yield;
            }
            func(1, duration);
        }
    }

    /**
     * Runs a list of script functions and stops when one of them ends.
     */
    export function either(...scriptFunctions: Script.FunctionLike[]): Script.Function {
        return function*() {
            let scripts: Script[] = scriptFunctions.map(sfn => new Script(sfn));
            if (A.isEmpty(scripts)) return;
            while (!scripts.some(s => s.isDone)) {
                for (let script of scripts) {
                    script.update(global.script.delta);
                }
                if (!scripts.some(s => s.isDone)) yield;
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

    export function loopForAtLeastTime(time: number, scriptFunctionIter: (t: number) => Script.Function): Script.Function {
        return function*() {
            let timer = new Timer(time);
            while (!timer.isDone) {
                yield S.either(
                    scriptFunctionIter(timer.progress),
                    S.doOverTime(Infinity, _ => timer.update(global.script.delta)),
                );
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

    export function revealText(world: World | undefined, text: SpriteText, rate: number, sound?: string): Script.Function {
        return function*() {
            text.visibleCharStart = 0;
            text.visibleCharEnd = 0;
            yield;
            while (!text.allCharactersVisible()) {
                text.visibleCharEnd++;
                if (sound && world) world.playSound(sound);
                yield S.wait(1/rate);
            }
        }
    }

    export function schedule(...schedule: [number, Script.FunctionLike, ...Array<number | Script.FunctionLike>]): Script.Function {
        let fns: { t: number, s: Script.FunctionLike }[] = [];
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

    export function simul(...scriptFunctions: Script.FunctionLike[]): Script.Function {
        return function*() {
            let scripts: Script[] = scriptFunctions.map(sfn => new Script(sfn));
            while (!A.isEmpty(scripts)) {
                scripts = scripts.filter(script => {
                    script.update(global.script.delta);
                    return !script.isDone;
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

    export function tweenColorLch<T extends Partial<Record<K, number>>, K extends keyof T>(duration: OrFactory<number>, obj: T, colorProp: K, start: number, end: number, easingFunction: Tween.Easing.Function = Tween.Easing.Linear): Script.Function {
        return S.doOverTime(duration, t => {
            obj[colorProp] = Color.lerpColorByLch(easingFunction(t), start, end) as any;
        });
    }

    export function tweenLocalPos(duration: OrFactory<number>, obj: WorldObject, start: Pt, end: Pt, easingFunctionX: Tween.Easing.Function = Tween.Easing.Linear, easingFunctionY: Tween.Easing.Function = easingFunctionX): Script.Function {
        let startx = start.x;
        let starty = start.y;
        let endx = end.x;
        let endy = end.y;
        return S.simul(
            S.tween(duration, obj, 'localx', startx, endx, easingFunctionX),
            S.tween(duration, obj, 'localy', starty, endy, easingFunctionY),
        );
    }

    export function tweenPt(duration: OrFactory<number>, pt: Pt, start: Pt, end: Pt, easingFunction?: Tween.Easing.Function): Script.Function;
    export function tweenPt(duration: OrFactory<number>, pt: Pt, start: Pt, end: Pt, easingFunctionX: Tween.Easing.Function, easingFunctionY: Tween.Easing.Function): Script.Function;
    export function tweenPt(duration: OrFactory<number>, pt: Pt, start: Pt, end: Pt, easingFunctionX: Tween.Easing.Function = Tween.Easing.Linear, easingFunctionY: Tween.Easing.Function = easingFunctionX): Script.Function {
        let startx = start.x;
        let starty = start.y;
        let endx = end.x;
        let endy = end.y;
        return S.simul(
            S.tween(duration, pt, 'x', startx, endx, easingFunctionX),
            S.tween(duration, pt, 'y', starty, endy, easingFunctionY),
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