class Chest extends Sprite {
    constructor(x: number, y: number) {
        super({
            name: 'chest',
            x, y,
            animations: [
                Animations.fromTextureList({ name: 'closed', textures: ['chest_closed'], frameRate: 1, count: Infinity }),
                Animations.fromTextureList({ name: 'open', textures: ['chest_open'], frameRate: 1, count: Infinity }),
            ],
            defaultAnimation: 'closed',
            layer: 'bg',
        });

        this.addChild(new CutsceneInteractable(0, -32, 'i_chest')).setBoundsSize(64, 64);
    }

    open() {
        this.playAnimation('open');
        this.world.playSound('crush');
    }

    close() {
        this.playAnimation('closed');
        this.world.playSound('crush');
    }
}