class PressX extends Sprite {
    private player: Player;

    constructor(player: Player) {
        super({
            texture: 'pressx',
            layer: 'pressx',
            visible: false,
        });

        this.player = player;
    }

    update() {
        super.update();

        if (this.player.closestInteractable && !global.theater.isCutscenePlaying) {
            this.teleport(this.player.closestInteractable.x, this.player.closestInteractable.y - 40);
            this.setVisible(true);
            this.setTexture(this.player.closestInteractable.pressTexture);
        } else {
            this.setVisible(false);
        }
    }
}