namespace WorldObject {
    export type Hooks<WO extends WorldObject> = {
        onAdd: { params: (this: WO) => void };
        onRemove: { params: (this: WO) => void };
        onPreUpdate: { params: (this: WO) => void };
        onUpdate: { params: (this: WO) => void };
        onVisualUpdate: { params: (this: WO) => void };
        onPostUpdate: { params: (this: WO) => void };
        onRender: { params: (this: WO, texture: Texture, x: number, y: number) => void };
        onKill: { params: (this: WO) => void };
    }

    export type HookName = keyof Hooks<WorldObject>;
    export type HookFunction<T extends HookName, WO extends WorldObject> = Hooks<WO>[T]['params'];
    export type Hook = { name: string, fn: Function };
    export type HooksConfig<WO extends WorldObject> = { [T in keyof Hooks<WO>]?: HookFunction<T, WO> | HookFunction<T, WO>[] };
}

class WorldObjectHookManager {
    private hooks: Dict<Function[]>;

    constructor() {
        this.hooks = {};
    }

    addHook<T extends WorldObject.HookName, WO extends WorldObject>(name: T, fn: WorldObject.HookFunction<T, WO>): WorldObject.Hook {
        if (!(name in this.hooks)) {
            this.hooks[name] = [];
        }
        this.hooks[name].push(fn);
        return { name, fn };
    }

    executeHooks<T extends WorldObject.HookName, WO extends WorldObject>(name: T, ...params: Parameters<WorldObject.Hooks<WO>[T]['params']>) {
        let hooks = this.hooks[name];
        if (A.isEmpty(hooks)) return;
        for (let hook of hooks) {
            hook(...params);
        }
    }

    removeHook(hook: WorldObject.Hook) {
        if (!(hook.name in this.hooks)) {
            console.error("Cannot remove hook because it does not exist", hook, this);
            return;
        }
        A.removeAll(this.hooks[hook.name], hook.fn);
    }
}