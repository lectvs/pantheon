/// <reference path="../worldObject/spriteText/spriteText.ts" />

namespace MenuTextButton {
    export type Config = SpriteText.Config & {
        onClick?: () => any;
    }
}

class MenuTextButton extends SpriteText {
    onClick: () => any;

    constructor(config: MenuTextButton.Config) {
        super(config);
        this.onClick = config.onClick ?? Utils.NOOP;
    }

    update(delta: number) {
        super.update(delta);
        if (this.isHovered()) {
            this.style.alpha = 0.5;
            if (Input.justDown(Input.GAME_SELECT)) {
                Input.consume(Input.GAME_SELECT);
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