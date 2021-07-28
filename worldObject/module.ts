class Module<T extends WorldObject> {
    protected type: new (...args) => T;
    protected worldObject: T;

    constructor(type: new (...args) => T) {
        this.type = type;
    }

    init(worldObject: WorldObject): void {
        if (!(worldObject instanceof this.type)) {
            error(`Tried to add Module<${this.type.name}> to a world object of incompatible type:`, worldObject);
            return;
        }
        this.worldObject = worldObject;
    }

    update(): void {}
    render(texture: Texture, x: number, y: number): void {}
}