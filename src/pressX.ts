class PressX extends Sprite {
    private player: Player;
    private currentTextureKey: string;

    constructor(player: Player) {
        super({
            texture: 'pressx',
            layer: 'pressx',
            visible: false,
        });

        this.player = player;
        this.currentTextureKey = 'pressx';
    }

    update() {
        super.update();

        if (this.player.closestInteractable && !global.theater.isCutscenePlaying) {
            this.teleport(this.player.closestInteractable.x, this.player.closestInteractable.y - 40);
            this.setVisible(true);
            if (this.player.closestInteractable.pressTexture !== this.currentTextureKey) {
                this.setTexture(this.player.closestInteractable.pressTexture);
                this.currentTextureKey = this.player.closestInteractable.pressTexture;
            }
        } else {
            this.setVisible(false);
        }
    }
}