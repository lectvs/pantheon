/// <reference path="../worldObject/sprite/sprite.ts" />

namespace DialogBox {
    export type Config = {
        dialogFont: SpriteText.Font;
        textAreaFull: Rect;
        textAreaPortrait: Rect;
        portraitPosition: Pt;
        startSound?: string;
    }
}

class DialogBox extends Sprite {
    charQueue: SpriteText.Character[];
    textAreaFull: Rect;
    textAreaPortrait: Rect;
    portraitPosition: Pt;
    startSound: string;

    textArea: Rect;
    done: boolean;

    private spriteText: SpriteText;
    private spriteTextOffset: number;
    private portraitSprite: Sprite;
    private characterTimer: Timer;

    constructor(config: DialogBox.Config) {
        super();

        this.charQueue = [];
        
        this.textAreaFull = config.textAreaFull;
        this.textAreaPortrait = config.textAreaPortrait;
        this.portraitPosition = config.portraitPosition;
        this.startSound = config.startSound;

        this.textArea = this.textAreaFull;
        this.done = true;

        this.spriteText = this.addChild(new SpriteText(config.dialogFont));
        this.spriteTextOffset = 0;

        this.portraitSprite = this.addChild(new Sprite());

        this.characterTimer = new Timer(0.05, () => this.advanceCharacter(), true);
    }

    update() {
        super.update();
        this.characterTimer.update(this.delta);

        if (this.done) {
            this.visible = false;
            this.spriteText.visible = false;
            this.portraitSprite.visible = false;
        }

        if (Input.justDown(Input.GAME_ADVANCE_DIALOG)) {
            this.advanceDialog();
        }
    }

    render(screen: Texture) {
        super.render(screen);

        if (this.portraitSprite.visible) {
            this.setPortraitSpriteProperties();
        }

        this.setSpriteTextProperties();
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

    setPortraitSpriteProperties() {
        this.portraitSprite.localx = this.portraitPosition.x;
        this.portraitSprite.localy = this.portraitPosition.y;
    }

    setSpriteTextProperties() {
        this.spriteText.localx = this.textArea.x;
        this.spriteText.localy = this.textArea.y - this.spriteTextOffset;
        this.spriteText.mask = {
            type: 'world',
            texture: Texture.filledRect(this.textArea.width, this.textArea.height, 0xFFFFFF),
            offsetx: this.x + this.textArea.x,
            offsety: this.y + this.textArea.y,
        };
    }

    showDialog(dialogText: string) {
        // Reset dialog properties.
        this.spriteText.clear();
        this.spriteTextOffset = 0;
        this.visible = true;
        this.spriteText.visible = true;
        this.done = false;

        this.charQueue = SpriteTextConverter.textToCharListWithWordWrap(dialogText, this.spriteText.font, this.textArea.width);
        this.characterTimer.reset();

        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.

        if (this.startSound) {
            this.world.playSound(this.startSound);
        }
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