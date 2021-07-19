class LockedDoor extends Sprite {
    constructor(x: number, y: number, name: string, movable: boolean) {
        super({
            name: name,
            x, y,
            texture: name,
            layer: 'doors',
            physicsGroup: 'walls',
            bounds: new RectBounds(-8, -16, 16, 32),
            immovable: !movable,
        });

        let i = this.addChild(new CutsceneInteractable(0, 0, `i_${name}`));
        i.setBoundsSize(24, 24);

        if (movable) {
            i.pressTexture = 'pressright';
        }
    }
}