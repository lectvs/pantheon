class Module<T extends WorldObject> {
    protected type: new (...args: any[]) => T;
    protected _worldObject!: T;

    get worldObject() { return this._worldObject; }

    constructor(type: new (...args: any[]) => T) {
        this.type = type;
    }

    init(worldObject: WorldObject): void {
        if (!(worldObject instanceof this.type)) {
            console.error(`Tried to add Module<${this.type.name}> to a world object of incompatible type:`, worldObject);
            return;
        }
        this._worldObject = worldObject;
    }

    update(): void {}
    render(): Render.Result {
        return FrameCache.array();
    }

    remove(): void {
        A.removeAll(this.worldObject.modules, this);
    }
}