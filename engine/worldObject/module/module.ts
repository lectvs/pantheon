namespace Module {
    // To add a new hook, simply add an entry here and call Module.hookManager.executeHooks() at the appropriate location(s).
    export type Hooks<M extends Module<WorldObject>> = {
        onUpdate: { params: (this: M) => void };
        onWorldObjectAdd: { params: (this: M) => void };
        onWorldObjectRemove: { params: (this: M) => void };
    }
}

class Module<T extends WorldObject> {
    protected worldObjectType: new (...args: any[]) => T;
    protected _worldObject!: T;

    protected hookManager: HookManager<Module.Hooks<this>>;

    get worldObject() { return this._worldObject; }
    get delta() { return this._worldObject.delta; }

    constructor(worldObjectType: new (...args: any[]) => T) {
        this.worldObjectType = worldObjectType;
        this.hookManager = new HookManager({
            binder: fn => fn.bind(this),
            hooks: {},
        });
    }

    addHook<T extends keyof Module.Hooks<this>>(name: T, fn: Module.Hooks<this>[T]['params'], config: Hook.Config = {}) {
        return this.hookManager.addHook(name, fn, config);
    }

    init(worldObject: WorldObject): void {
        if (!(worldObject instanceof this.worldObjectType)) {
            console.error(`Tried to add Module<${this.worldObjectType.name}> to a world object of incompatible type:`, worldObject);
            return;
        }
        this._worldObject = worldObject;
        this.onAdd();
    }

    onAdd(): void {}
    onRemove(): void {}
    
    onWorldObjectAdd() : void {
        this.hookManager.executeHooks('onWorldObjectAdd');
    }
    onWorldObjectRemove() : void {
        this.hookManager.executeHooks('onWorldObjectRemove');
    }

    preUpdate(): void {}
    update(): void {
        this.hookManager.executeHooks('onUpdate');
    }
    postUpdate(): void {}

    render(): Render.Result {
        return FrameCache.array();
    }

    removeFromWorldObject(): void {
        this.onRemove();
        A.removeAll(this.worldObject.modules, this);
    }

    removeHook(hook: Hook) {
        this.hookManager.removeHook(hook);
    }
}