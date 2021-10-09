/// <reference path="../worldObject/sprite/sprite.ts" />

namespace DialogBox {
    export type Config = Sprite.Config & {
        defaultTextFont: string;
        textAreaFull: Rect;
        textAreaPortrait: Rect;
        portraitPosition: Pt;
        nameTexture: string;
        nameFont: string;
        namePosition: Pt;
        nameTextOffset: Pt;
        defaultDialogStart: string;
        defaultDialogSpeak: string;
    }
}

class DialogBox extends Sprite {
    private textAreaFull: Rect;
    private textAreaPortrait: Rect;

    private defaultTextFont: string;
    private defaultDialogStart: string;
    private defaultDialogSpeak: string;
    private dialogStart: string;
    private dialogSpeak: string;
    
    private get textArea() { return this.portraitObject ? this.textAreaPortrait : this.textAreaFull; }

    done: boolean;

    private currentProfileKey: string;
    private currentProfileEntry: string;

    private spriteText: SpriteText;
    private spriteTextOffset: number;
    private portrait: WorldObject;
    private portraitObject: WorldObject;
    private nameSprite: Sprite;
    private nameText: SpriteText;

    private characterTimer: Timer;
    private speakSoundTimer: Timer;

    constructor(config: DialogBox.Config) {
        super(config);

        this.textAreaFull = config.textAreaFull;
        this.textAreaPortrait = config.textAreaPortrait;

        this.defaultTextFont = config.defaultTextFont;
        this.defaultDialogStart = config.defaultDialogStart;
        this.defaultDialogSpeak = config.defaultDialogSpeak;
        this.dialogStart = config.defaultDialogStart;
        this.dialogSpeak = config.defaultDialogSpeak;

        this.done = true;

        this.spriteText = this.addChild(new SpriteText({ font: this.defaultTextFont }));
        this.spriteTextOffset = 0;

        this.portrait = this.addChild(new WorldObject({ x: config.portraitPosition.x, y: config.portraitPosition.y }));

        this.nameSprite = this.addChild(new Sprite({ x: config.namePosition.x, y: config.namePosition.y, texture: config.nameTexture }));
        this.nameText = this.nameSprite.addChild(new SpriteText({ x: config.nameTextOffset.x, y: config.nameTextOffset.y, font: config.nameFont, anchor: Vector2.CENTER }));

        this.characterTimer = new Timer(0.05, () => this.advanceCharacter(), Infinity);

        this.speakSoundTimer = new Timer(0.05, () => {
            let p = this.getDialogProgression() < 0.9 ? 0.85 : 1;  // 85% normally, but 100% if dialog is close to ending
            if (this.dialogSpeak && Debug.SKIP_RATE < 2 && !this.isPageComplete() && Random.boolean(p)) {
                let sound = this.world.playSound(this.dialogSpeak);
                sound.speed = Random.float(0.95, 1.05);
            }
        }, Infinity);
    }

    update() {
        super.update();

        this.spriteText.localx = this.textArea.x;
        this.spriteText.localy = this.textArea.y - this.spriteTextOffset;
        this.spriteText.maxWidth = this.textArea.width;
        this.spriteText.mask = {
            type: 'world',
            texture: this.spriteText.mask ? this.spriteText.mask.texture : Texture.filledRect(this.textArea.width, this.textArea.height, 0xFFFFFF),
            offsetx: this.x + this.textArea.x,
            offsety: this.y + this.textArea.y,
        };

        // Visibility must be set before dialog progression to avoid a 1-frame flicker.
        this.setVisible(!this.done);

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

        if (this.dialogStart) {
            this.world.playSound(this.dialogStart);
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

        if (this.dialogStart) {
            this.world.playSound(this.dialogStart);
        }
    }

    setProfile(profileKey: string, entry: string) {
        if (profileKey === this.currentProfileKey && entry === this.currentProfileEntry) return;

        let profile = DialogProfiles.getProfile(profileKey);
        if (!profile) return;

        // Portrait
        if (this.portraitObject) {
            this.portraitObject.removeFromWorld();
            this.portraitObject = null;
        }
        let portrait = profile.getPortrait(entry);
        if (portrait) {
            this.portraitObject = this.portrait.addChild(portrait);
        }

        // Name
        let name = profile.getName(entry);
        if (name) {
            this.nameText.setText(name);
            this.nameSprite.setVisible(true);
        } else {
            this.nameSprite.setVisible(false);
        }

        // Font
        this.spriteText.setFont(profile.getFont(entry) || this.defaultTextFont);

        // Dialog sounds
        this.dialogStart = profile.getDialogStart(entry) || this.defaultDialogStart;
        this.dialogSpeak = profile.getDialogSpeak(entry) || this.defaultDialogSpeak;

        this.currentProfileKey = profileKey;
        this.currentProfileEntry = entry;

        this.update();
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