class Item extends Sprite {
    constructor(x: number, y: number, name: string) {
        super({
            name: name,
            x, y,
            texture: name,
            layer: 'items',
        });

        this.addChild(new CutsceneInteractable(0, 0, `item_${name}`));
    }
}