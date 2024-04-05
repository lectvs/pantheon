/// <reference path="../worldObject/spriteText/spriteText.ts" />

namespace MenuTextButton {
    export type Config = SpriteText.Config<MenuTextButton> & {
        onClick?: (this: MenuTextButton) => void;
        onHover?: (this: MenuTextButton) => void;
        onJustHovered?: (this: MenuTextButton) => void;
        hoverColor?: number;
    }
}

class MenuTextButton extends SpriteText {
    private bounds: RectBounds;
    enabled: boolean;

    constructor(config: MenuTextButton.Config) {
        super(config);
        this.bounds = new RectBounds(0, 0, 0, 0, this);
        this.enabled = true;

        let button = this.addModule(new Button({
            hoverTint: config.hoverColor ?? 0x808080,
            clickTint: config.hoverColor ?? 0x808080,
            onHover: () => {
                if (config.onHover) config.onHover.apply(this);
            },
            onJustHovered: () => {
                if (config.onJustHovered) config.onJustHovered.apply(this);
            },
            onClick: () => {
                if (config.onClick) config.onClick.apply(this);
            }
        }));
        button.baseTint = this.tint;
    }

    override update() {
        super.update();
        this.setBounds();

        let button = this.getModule(Button);
        if (button) {
            button.enabled = this.enabled && this.isHighestPriority();
        }
    }

    private setBounds() {
        let textBounds = this.getVisibleWorldBounds$();
        if (textBounds) {
            this.bounds.x = textBounds.x - this.x;
            this.bounds.y = textBounds.y - this.y;
            this.bounds.width = textBounds.width;
            this.bounds.height = textBounds.height;
        } else {
            this.bounds.x = this.x;
            this.bounds.y = this.y;
            this.bounds.width = 0;
            this.bounds.height = 0;
        }
    }

    isHighestPriority() {
        return true;
    }
}

namespace MenuNumericSelector {
    export type Config = SpriteText.Config<MenuNumericSelector> & {
        barLength: number;
        minValue: number;
        maxValue: number;
        getValue: () => number;
        setValue: (value: number) => any;
    }
}

class MenuNumericSelector extends SpriteText {
    barLength: number;
    minValue: number;
    maxValue: number;
    getValue: () => number;
    setValue: (value: number) => any;

    constructor(config: MenuNumericSelector.Config) {
        super(config);
        this.barLength = config.barLength;
        this.minValue = config.minValue;
        this.maxValue = config.maxValue;
        this.getValue = config.getValue;
        this.setValue = config.setValue;

        let leftButton = this.addChild(new MenuTextButton({
            font: this.fontKey,
            text: "\\<",
            onClick: () => {
                global.game.playSound('click');
                let bars = this.getFullBarsForValue(this.getValue());
                if (bars > 0) {
                    let newValue = this.getValueForFullBars(bars - 1);
                    this.setValue(newValue);
                }
            }
        }));
        leftButton.style = this.style;

        let rightButton = this.addChild(new MenuTextButton({
            font: this.fontKey,
            text: ">",
            onClick: () => {
                global.game.playSound('click');
                let bars = this.getFullBarsForValue(this.getValue());
                if (bars < this.barLength) {
                    let newValue = this.getValueForFullBars(bars + 1);
                    this.setValue(newValue);
                }
            }
        }));
        rightButton.localx = (this.barLength+3) * this.font.charWidth;
        rightButton.style = this.style;
    }

    override update() {
        super.update();
        
        let fullBars = this.getFullBarsForValue(this.getValue());

        let text = "  " + "[color 0xCCCCCC]|[/color]".repeat(fullBars) + "[color 0x444444]|[/color]".repeat(this.barLength - fullBars);
        this.setText(text);
    }

    protected getFullBarsForValue(value: number) {
        let valueNormalized = M.clamp((value - this.minValue) / (this.maxValue - this.minValue), 0, 1);
        return Math.floor(valueNormalized * this.barLength);
    }

    protected getValueForFullBars(fullBars: number) {
        let fullBarsNormalized = fullBars / this.barLength;
        return this.minValue + (this.maxValue - this.minValue) * fullBarsNormalized;
    }
}
