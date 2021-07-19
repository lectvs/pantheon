class CrackedWall extends Sprite {
    constructor(x: number, y: number) {
        super({
            x, y,
            texture: 'crackedwall',
            layer: 'doors',
            physicsGroup: 'walls',
            bounds: new RectBounds(0, 0, 32, 64),
            immovable: true
        });

        this.addChild(new CutsceneInteractable(0, 48, 'i_crackedwall'));
    }
}