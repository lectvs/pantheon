type Hook = { name: string, fn: Function };
type HookSet = Dict<{ params: (...params: any[]) => void }>;
type HooksConfig<Hooks extends HookSet> = { [T in keyof Hooks]?: Hooks[T]['params'] | Hooks[T]['params'][] };

namespace Hook {
    export type Config = {
        runOnce?: boolean;
    }
}

namespace HookManager {
    export type Config<Hooks extends HookSet> = {
        binder?: (fn: Function) => Function;
        hooks?: HooksConfig<Hooks>;
    }
}

class HookManager<Hooks extends HookSet> {
    private binder: (fn: Function) => Function;
    private hooks: Dict<{
        hookFn: Function;
        runOnce: boolean;
    }[]>;

    constructor(config: HookManager.Config<Hooks>) {
        this.hooks = {};

        this.binder = config.binder ?? (fn => fn);

        if (config.hooks) {
            for (let key in config.hooks) {
                let hookName = key as string & keyof Hooks;
                let hooks = config.hooks[hookName];
                if (A.isArray(hooks)) {
                    for (let hook of hooks) {
                        this.addHook(hookName, hook);
                    }
                } else {
                    this.addHook(hookName, hooks as any);
                }
            }
        }
    }

    addHook<T extends string & keyof Hooks>(name: T, fn: Hooks[T]['params'], config: Hook.Config = {}): Hook {
        if (!(name in this.hooks)) {
            this.hooks[name] = [];
        }
        let boundFn = this.binder(fn);
        this.hooks[name].push({
            hookFn: boundFn,
            runOnce: config.runOnce ?? false,
        });
        return { name, fn: boundFn };
    }

    executeHooks<T extends string & keyof Hooks>(name: T, ...params: Parameters<Hooks[T]['params']>) {
        let hooks = this.hooks[name];
        if (A.isEmpty(hooks)) return;
        for (let hook of hooks) {
            hook.hookFn(...params);
        }
        hooks.filterInPlace(hook => !hook.runOnce);
    }

    executeHooksWithReturnValue$<T extends string & keyof Hooks>(name: T, ...params: Parameters<Hooks[T]['params']>) {
        let hooks = this.hooks[name];
        if (A.isEmpty(hooks)) return FrameCache.array();
        let result: ReturnType<Hooks[T]['params']>[] = FrameCache.array();
        for (let hook of hooks) {
            result.push(hook.hookFn(...params));
        }
        hooks.filterInPlace(hook => !hook.runOnce);
        return result;
    }

    hasHooks(name: string & keyof Hooks) {
        return !A.isEmpty(this.hooks[name]);
    }

    removeHook(hook: Hook) {
        if (!(hook.name in this.hooks)) {
            console.error("Cannot remove hook because it does not exist", hook, this);
            return;
        }
        this.hooks[hook.name].filterInPlace(h => h.hookFn !== hook.fn)
    }
}