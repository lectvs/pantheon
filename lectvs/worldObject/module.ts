class Module<T extends WorldObject> {
    worldObject: T;

    init(): void {}
    update(): void {}
    render(texture: Texture, x: number, y: number): void {}
}