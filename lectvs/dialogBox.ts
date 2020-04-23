/// <reference path="./sprite.ts" />

namespace DialogBox {
    export type Config = Sprite.Config & {
        texture: string;
        spriteTextFont: SpriteText.Font;
        textAreaFull: Rect;
        textAreaPortrait: Rect;
        portraitPosition: Pt;
        advanceKey: string;
    }
}

class DialogBox extends Sprite {
    charQueue: SpriteText.Character[];
    textAreaFull: Rect;
    textAreaPortrait: Rect;
    portraitPosition: Pt;
    advanceKey: string;

    textArea: Rect;
    done: boolean;

    private spriteText: SpriteText;
    private spriteTextOffset: number;
    private portraitSprite: Sprite;
    private characterTimer: Timer;

    constructor(config: DialogBox.Config) {
        super(config);

        this.charQueue = [];
        
        this.textAreaFull = config.textAreaFull;
        this.portraitPosition = config.portraitPosition;
        this.textAreaPortrait = config.textAreaPortrait;
        this.advanceKey = config.advanceKey;

        this.textArea = this.textAreaFull;
        this.done = true;

        this.spriteText = new SpriteText({
            font: config.spriteTextFont,
        });
        let textAreaWorldRect = this.getTextAreaWorldRect();
        this.spriteText.mask = new Texture(global.gameWidth, global.gameHeight);
        Draw.brush.color = 0xFFFFFF;
        Draw.brush.alpha = 1;
        Draw.rectangleSolid(this.spriteText.mask, textAreaWorldRect.x, textAreaWorldRect.y, textAreaWorldRect.width, textAreaWorldRect.height);
        this.spriteTextOffset = 0;

        this.portraitSprite = new Sprite({});

        this.characterTimer = new Timer(0.05, () => this.advanceCharacter(), true);
    }

    update(delta: number) {
        super.update(delta);
        this.characterTimer.update(delta);

        if (this.done) {
            this.visible = false;
        }

        if (Input.justDown(this.advanceKey)) {
            this.advanceDialog();
        }
    }

    render(screen: Texture) {
        super.render(screen);

        if (this.portraitSprite.visible) {
            this.setPortraitSpriteProperties();
            this.portraitSprite.render(screen);
        }

        this.setSpriteTextProperties();
        this.spriteText.render(screen);
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
        this.done = true;
    }

    completePage() {
        let iters = 0;
        while (this.advanceCharacter() && iters < DialogBox.MAX_COMPLETE_PAGE_ITERS) {
            iters++;
        }
    }

    getPortraitWorldPosition(): Pt {
        return {
            x: this.x + this.portraitPosition.x,
            y: this.y + this.portraitPosition.y,
        };
    }

    getTextAreaWorldRect(): Rect {
        return {
            x: this.x + this.textArea.x,
            y: this.y + this.textArea.y,
            width: this.textArea.width,
            height: this.textArea.height,
        };
    }

    setPortraitSpriteProperties() {
        this.portraitSprite.x = this.x + this.portraitPosition.x;
        this.portraitSprite.y = this.y + this.portraitPosition.y;
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
        this.done = false;

        this.charQueue = SpriteTextConverter.textToCharListWithWordWrap(dialogText, this.spriteText.font, this.textArea.width);
        this.characterTimer.reset();

        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.
    }

    showPortrait(portrait: string) {
        if (!portrait || portrait === DialogBox.NONE_PORTRAIT) {
            this.portraitSprite.visible = false;
            this.textArea = this.textAreaFull;
        } else {
            this.portraitSprite.setTexture(portrait);
            this.portraitSprite.visible = true;
            this.textArea = this.textAreaPortrait;
        }
    }

    static MAX_COMPLETE_PAGE_ITERS: number = 10000;
    static NONE_PORTRAIT: string = 'none';
}