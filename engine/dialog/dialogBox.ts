/// <reference path="../worldObject/sprite/sprite.ts" />

namespace DialogBox {
    export type Config = Sprite.Config<DialogBox> & {
        font?: string;
        textAreaFull?: Rect;
        textAreaPortrait?: Rect;
        portraitPosition?: Pt;
        namePlate?: {
            texture: string;
            position: Pt;
            textOffset: Pt;
            font?: string;
        };
        defaultDialogStart?: string;
        defaultDialogSpeak?: string;
        advanceIndicator?: {
            texture: string | PIXI.Texture;
            position: Pt;
            movementLength: number;
            movementSpeed: number;
        };
    }
}

class DialogBox extends Sprite {
    private textAreaFull: Rect;
    private textAreaPortrait: Rect;

    private defaultTextFont: string;
    private defaultDialogStart: string | undefined;
    private defaultDialogSpeak: string | undefined
    private dialogStart: string | undefined;
    private dialogSpeak: string | undefined;
    private isAdvanceIndicatorEnabled: boolean;
    
    private get textArea() { return this.portraitObject ? this.textAreaPortrait : this.textAreaFull; }

    isDone: boolean;

    private currentProfileKey: string | undefined;
    private currentProfileEntry: string | undefined;

    private spriteText: SpriteText;
    private spriteTextOffset: number;
    private portrait: WorldObject;
    private portraitObject: WorldObject | undefined;
    private nameSprite: Sprite;
    private nameText: SpriteText;
    private advanceIndicator: Sprite;

    private characterTimer: Timer;
    private speakSoundTimer: Timer;

    constructor(config: DialogBox.Config) {
        super(config);

        this.textAreaFull = config.textAreaFull ?? this.getVisibleLocalBounds$()?.clone() ?? rect(0, 0, 0, 0);
        this.textAreaPortrait = config.textAreaPortrait ?? this.getVisibleLocalBounds$()?.clone() ?? rect(0, 0, 0, 0);

        this.defaultTextFont = config.font ?? SpriteText.DEFAULT_FONT;
        this.defaultDialogStart = config.defaultDialogStart;
        this.defaultDialogSpeak = config.defaultDialogSpeak;
        this.dialogStart = config.defaultDialogStart;
        this.dialogSpeak = config.defaultDialogSpeak;
        this.isAdvanceIndicatorEnabled = !!config.advanceIndicator;

        this.isDone = true;

        this.spriteText = this.addChild(new SpriteText({
            font: this.defaultTextFont,
            anchor: Anchor.TOP_LEFT,
            justify: 'left',
        }));
        this.spriteTextOffset = 0;

        this.portrait = this.addChild(new WorldObject({
            p: config.portraitPosition,
        }));

        this.nameSprite = this.addChild(new Sprite({
            p: config.namePlate?.position,
            texture: config.namePlate?.texture,
        }));
        this.nameText = this.nameSprite.addChild(new SpriteText({
            p: config.namePlate?.textOffset,
            font: config.namePlate?.font ?? this.defaultTextFont,
        }));

        this.advanceIndicator = this.addChild(new Sprite({
            p: config.advanceIndicator?.position,
            texture: config.advanceIndicator?.texture,
            visible: false,
            hooks: {
                onUpdate: Hooks.oscillate('offsetX', -(config.advanceIndicator?.movementLength ?? 0), 0, config.advanceIndicator?.movementSpeed ?? 1),
            },
        }));

        this.characterTimer = new Timer(0.02, () => this.advanceCharacter(), Infinity);

        this.speakSoundTimer = new Timer(0.08, () => {
            let p = this.getDialogProgression() < 0.8 ? 0.95 : 1;  // 95% normally, but 100% if dialog is close to ending
            if (this.dialogSpeak && Debug.SKIP_RATE < 2 && !this.isPageComplete() && Random.boolean(p)) {
                let sound = this.world!.playSound(this.dialogSpeak);
                sound.speed = Random.float(0.95, 1.05);
            }
        }, Infinity);
    }

    override update() {
        super.update();

        this.spriteText.localx = this.textArea.x;
        this.spriteText.localy = this.textArea.y - this.spriteTextOffset;
        this.spriteText.maxWidth = this.textArea.width;

        // Visibility must be set before dialog progression to avoid a 1-frame flicker.
        this.setVisible(!this.isDone);

        if (!this.isDone) {
            this.updateDialogProgression();
            this.speakSoundTimer.update(this.delta);
        }

        this.advanceIndicator.setVisible(this.isPageComplete() && this.isAdvanceIndicatorEnabled);
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
        this.isDone = false;

        this.spriteText.setText(dialogText);
        this.spriteText.visibleCharStart = 0;
        this.spriteText.visibleCharEnd = 0;
        this.spriteTextOffset = 0;
        this.characterTimer.reset();

        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.

        if (this.dialogStart) {
            this.world?.playSound(this.dialogStart);
        }
    }

    addToDialog(additionalText: string) {
        this.isDone = false;

        let newCurrentText = this.spriteText.getCurrentText() + additionalText;
        let newVisibleCharEnd = this.spriteText.visibleCharEnd;

        this.spriteText.setText(newCurrentText);
        this.spriteText.visibleCharEnd = newVisibleCharEnd;
        this.characterTimer.reset();

        this.advanceCharacter(); // Advance character once to start the dialog with one displayed character.

        if (this.dialogStart) {
            this.world?.playSound(this.dialogStart);
        }
    }

    setProfile(profileKey: string, entry: string) {
        if (profileKey === this.currentProfileKey && entry === this.currentProfileEntry) return;

        let profile = DialogProfiles.getProfile(profileKey);
        if (!profile) return;

        // Portrait
        if (this.portraitObject) {
            this.portraitObject.removeFromWorld();
            this.portraitObject = undefined;
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
        while (!this.isDone) {
            this.completePage();
            this.advancePage();
        }
    }

    private advanceCharacter() {
        if (!this.isPageComplete()) {
            this.spriteText.visibleCharEnd++;
        }
    }

    private advancePage() {
        if (this.isDialogComplete()) {
            this.isDone = true;
        } else {
            this.spriteTextOffset = this.spriteText.getVisibleTextHeight(0, this.spriteText.visibleCharEnd);
            this.spriteText.visibleCharStart = this.spriteText.visibleCharEnd;
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
        return this.spriteText.visibleCharEnd / this.spriteText.getCharList().length;
    }

    private isPageComplete() {
        if (this.isDialogComplete()) return true;
        let nextHeight = this.spriteText.getVisibleTextHeight(0, this.spriteText.visibleCharEnd+1);
        return nextHeight > this.textArea.height + this.spriteTextOffset;
    }

    static MAX_COMPLETE_PAGE_ITERS: number = 10000;
}