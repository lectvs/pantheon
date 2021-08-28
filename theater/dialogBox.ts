/// <reference path="../worldObject/sprite/sprite.ts" />

namespace DialogBox {
    export type Config = Sprite.Config & {
        dialogFont: string;
        textAreaFull: Rect;
        textAreaPortrait: Rect;
        portraitPosition: Pt;
        startSound?: string;
        speakSound?: string;
        nameProps?: NameConfig;
    }

    export type NameConfig = {
        texture: string;
        position: Pt;
        textOffset: Pt;
    }
}

class DialogBox extends Sprite {
    private textAreaFull: Rect;
    private textAreaPortrait: Rect;
    private portraitPosition: Vector2;

    private startSound: string;
    private speakSound: string;

    private nameTexture: string;
    private namePosition: Vector2;
    private nameTextOffset: Vector2;
    
    private isShowingPortrait: boolean;
    private isShowingName: boolean;
    private get textArea() { return this.isShowingPortrait ? this.textAreaPortrait : this.textAreaFull; }

    done: boolean;

    private spriteText: SpriteText;
    private spriteTextOffset: number;
    private portraitSprite: Sprite;
    private nameSprite: Sprite;
    private nameText: SpriteText;

    private characterTimer: Timer;
    private speakSoundTimer: Timer;

    constructor(config: DialogBox.Config) {
        super(config);

        this.textAreaFull = config.textAreaFull;
        this.textAreaPortrait = config.textAreaPortrait;
        this.portraitPosition = vec2(config.portraitPosition);

        this.startSound = config.startSound;
        this.speakSound = config.speakSound;

        if (config.nameProps) {
            this.nameTexture = config.nameProps.texture;
            this.namePosition = vec2(config.nameProps.position);
            this.nameTextOffset = vec2(config.nameProps.textOffset);
        }

        this.isShowingPortrait = false;
        this.isShowingName = false;
        this.done = true;

        this.spriteText = this.addChild(new SpriteText({ font: config.dialogFont }));
        this.spriteTextOffset = 0;

        this.portraitSprite = this.addChild(new Sprite());
        this.showPortrait('none');

        this.nameSprite = this.addChild(new Sprite({ texture: this.nameTexture }));
        this.nameText = this.nameSprite.addChild(new SpriteText({ font: config.dialogFont, anchor: Vector2.CENTER }));
        this.showName(undefined);

        this.characterTimer = new Timer(0.05, () => this.advanceCharacter(), Infinity);

        this.speakSoundTimer = new Timer(0.05, () => {
            let p = this.getDialogProgression() < 0.9 ? 0.85 : 1;  // 85% normally, but 100% if dialog is close to ending
            if (this.speakSound && Debug.SKIP_RATE < 2 && !this.isPageComplete() && Random.boolean(p)) {
                let sound = this.world.playSound(this.speakSound);
                sound.speed = Random.float(0.95, 1.05);
            }
        }, Infinity);
    }

    update() {
        super.update();

        // Visibility must be set before dialog progression to avoid a 1-frame flicker.
        this.setVisible(!this.done);
        this.spriteText.setVisible(!this.done);
        this.portraitSprite.setVisible(!this.done && this.isShowingPortrait);
        this.nameSprite.setVisible(!this.done && this.isShowingName);

        if (!this.done) {
            this.updateDialogProgression();
            this.speakSoundTimer.update(this.delta);
        }
    }

    private updateDialogProgression() {
        this.characterTimer.update(this.delta);
        if (Input.justDown(Input.GAME_ADVANCE_CUTSCENE)) {
            Input.consume(Input.GAME_ADVANCE_CUTSCENE);
            this.advanceDialog();
        }
    }

    render(texture: Texture, x: number, y: number) {
        super.render(texture, x, y);

        if (this.portraitSprite.isVisible()) {
            this.setPortraitSpriteProperties();
        }

        if (this.nameSprite.isVisible()) {
            this.setNameSpriteProperties();
        }

        this.setSpriteTextProperties();
    }

    advanceDialog() {
        if (this.isPageComplete()) {
            this.advancePage();
        } else {
            this.completePage();
        }
    }

    showDialog(dialogText: string) {
        this.spriteText.clear();
        this.spriteTextOffset = 0;
        this.done = false;

        this.spriteText.setText(dialogText);
        this.spriteText.visibleCharCount = 0;
        this.spriteTextOffset = 0;
        this.characterTimer.reset();

        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.

        if (this.startSound) {
            this.world.playSound(this.startSound);
        }
    }

    addToDialog(additionalText: string) {
        this.done = false;

        let newCurrentText = this.spriteText.getCurrentText() + additionalText;
        let newVisibleCharCount = this.spriteText.visibleCharCount;

        this.spriteText.setText(newCurrentText);
        this.spriteText.visibleCharCount = newVisibleCharCount;
        this.characterTimer.reset();

        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.

        if (this.startSound) {
            this.world.playSound(this.startSound);
        }
    }

    showPortrait(portrait: string) {
        this.portraitSprite.setTexture(portrait);
        this.isShowingPortrait = !AssetCache.isNoneTexture(portrait);
        this.spriteText.maxWidth = this.textArea.width;
    }

    showName(name: string) {
        if (!name) {
            this.isShowingName = false;
            return;
        }

        this.isShowingName = true;
        this.nameText.setText(name);
    }

    setSpeakSound(key: string) {
        this.speakSound = key;
    }

    complete() {
        while (!this.done) {
            this.completePage();
            this.advancePage();
        }
    }

    private advanceCharacter() {
        if (!this.isPageComplete()) {
            this.spriteText.visibleCharCount++;
        }
    }

    private advancePage() {
        if (this.isDialogComplete()) {
            this.done = true;
        } else {
            this.spriteTextOffset = this.spriteText.getTextHeight();
        }
    }

    private completePage() {
        let iters = 0;
        while (!this.isPageComplete() && iters < DialogBox.MAX_COMPLETE_PAGE_ITERS) {
            this.advanceCharacter();
            iters++;
        }

        if (!this.isPageComplete()) {
            this.advancePage();
        }
    }

    private setPortraitSpriteProperties() {
        this.portraitSprite.localx = this.portraitPosition.x;
        this.portraitSprite.localy = this.portraitPosition.y;
    }

    private setNameSpriteProperties() {
        this.nameSprite.localx = this.namePosition.x;
        this.nameSprite.localy = this.namePosition.y;
        this.nameText.localx = this.nameTextOffset.x;
        this.nameText.localy = this.nameTextOffset.y;
    }

    private setSpriteTextProperties() {
        this.spriteText.localx = this.textArea.x;
        this.spriteText.localy = this.textArea.y - this.spriteTextOffset;
        this.spriteText.mask = {
            type: 'world',
            texture: Texture.filledRect(this.textArea.width, this.textArea.height, 0xFFFFFF),
            offsetx: this.x + this.textArea.x,
            offsety: this.y + this.textArea.y,
        };
    }

    private isDialogComplete() {
        return this.getDialogProgression() >= 1;
    }

    private getDialogProgression() {
        return this.spriteText.visibleCharCount / this.spriteText.getCharList().length;
    }

    private isPageComplete() {
        if (this.isDialogComplete()) return true;
        let nextHeight = SpriteText.getHeightOfCharList(this.spriteText.getCharList(), this.spriteText.visibleCharCount + 1);
        return nextHeight > this.textArea.height + this.spriteTextOffset;
    }

    static MAX_COMPLETE_PAGE_ITERS: number = 10000;
}