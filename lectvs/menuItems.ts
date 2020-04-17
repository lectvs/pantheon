/// <reference path="spriteText.ts" />

class MenuTextButton extends SpriteText {
    onClick: () => any;

    constructor(config: SpriteText.Config & { onClick?: () => any }) {
        super(config);
        this.onClick = O.getOrDefault(config.onClick, () => null);
    }

    update(delta: number) {
        super.update(delta);
        if (this.isHovered()) {
            this.style.alpha = 0.5;
            if (Input.justDown('lmb')) {
                Input.consume('lmb');
                this.onClick();
            }
        } else {
            this.style.alpha = 1;
        }
    }

    isHovered() {
        return G.rectContainsPt(this.getTextWorldBounds(), this.world.getWorldMousePosition());
    }
}