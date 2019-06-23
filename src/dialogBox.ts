/// <reference path="./sprite.ts" />

namespace DialogBox {
    export type Config = Sprite.Config & {
        texture: string;
        spriteTextFont: SpriteText.Font;
        textArea: Rect;
        advanceKey: string;
    }
}

class DialogBox extends Sprite {
    charQueue: SpriteText.Character[];
    textArea: Rect;
    advanceKey: string;

    spriteTextOffset: number;

    private spriteText: SpriteText;
    private spriteTextMask: PIXI.Graphics;
    private characterTimer: Timer;

    constructor(config: DialogBox.Config) {
        super(config);

        this.charQueue = [];
        this.textArea = config.textArea;
        this.advanceKey = config.advanceKey;

        this.spriteTextOffset = 0;

        this.spriteText = new SpriteText({
            font: config.spriteTextFont,
        });
        this.spriteTextMask = Mask.newRectangleMask(this.getTextAreaWorldRect());
        this.spriteText.mask = this.spriteTextMask;

        this.characterTimer = new Timer(0.05, () => this.advanceCharacter(), true);
    }

    update(delta: number, world?: World) {
        super.update(delta, world);
        this.characterTimer.update(delta);

        if (Input.justDown(this.advanceKey)) {
            this.advanceDialog();
        }
    }

    render(renderer: PIXI.Renderer, renderTexture?: PIXI.RenderTexture) {
        super.render(renderer, renderTexture);

        this.setSpriteTextProperties();
        this.drawMask();
        this.spriteText.render(renderer, renderTexture);
    }

    advanceDialog() {
        if (this.advanceCharacter()) {
            this.completePage();
        } else if (!_.isEmpty(this.charQueue)) {
            this.advancePage();
        } else {
            this.completeDialog();
        }
    }

    advanceCharacter() {
        if (!_.isEmpty(this.charQueue) && this.charQueue[0].bottom <= this.spriteTextOffset + this.textArea.height) {
            this.spriteText.chars.push(this.charQueue.shift());
            return true;
        }
        return false;
    }

    advancePage() {
        this.completePage();
        this.spriteTextOffset = this.spriteText.getTextHeight();
    }

    completeDialog() {
        this.visible = false;
    }

    completePage() {
        let iters = 0;
        while (this.advanceCharacter() && iters < DialogBox.MAX_COMPLETE_PAGE_ITERS) {
            iters++;
        }
    }

    drawMask() {
        Mask.drawRectangleMask(this.spriteTextMask, this.getTextAreaWorldRect());
    }

    getTextAreaWorldRect(): Rect {
        return {
            x: this.x + this.textArea.x,
            y: this.y + this.textArea.y,
            width: this.textArea.width,
            height: this.textArea.height,
        };
    }

    setSpriteTextProperties() {
        this.spriteText.x = this.x + this.textArea.x;
        this.spriteText.y = this.y + this.textArea.y - this.spriteTextOffset;
    }

    showDialog(dialogText: string) {
        // Reset dialog properties.
        this.spriteText.clear();
        this.spriteTextOffset = 0;
        this.visible = true;

        this.charQueue = SpriteTextConverter.textToCharListWithWordWrap(dialogText, this.spriteText.font, this.textArea.width);
        this.characterTimer.reset();

        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.
    }

    static MAX_COMPLETE_PAGE_ITERS: number = 10000;
}