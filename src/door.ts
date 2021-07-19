/// <reference path="./interactable.ts" />

class Door extends Interactable {
    toX: number;
    toY: number;

    constructor(x: number, y: number, toX: number, toY: number) {
        super({
            x, y,
            bounds: new RectBounds(-8, -8, 16, 16),
        });

        this.toX = toX;
        this.toY = toY;
    }

    interact() {
        super.interact();

        let player = this.world.select.type(Player);
        player.teleport(this.toX, this.toY);
        global.world.playSound('door');
    }
}