class Note extends Sprite {
    constructor(x: number, y: number) {
        super({
            name: 'note',
            x, y,
            texture: 'note',
            layer: 'bg',
        });

        this.addChild(new CutsceneInteractable(0, 0, 'i_note'));
    }
}