/// <reference path="../worldObject/spriteText/spriteText.ts" />

namespace MenuTextButton {
    export type Config = SpriteText.Config<MenuTextButton> & {
        onClick?: (this: MenuTextButton) => void;
        onStateChange?: (this: MenuTextButton, state: UIElement.State) => void;
        tinting?: UIElement.Tinting;
    }
}

class MenuTextButton extends SpriteText {
    private bounds: RectBounds;
    enabled: boolean;

    constructor(config: MenuTextButton.Config) {
        super(config);
        this.bounds = new RectBounds(0, 0, 0, 0, this);
        this.enabled = true;

        let tinting = config.tinting ? O.withDefaults(config.tinting, {
            hover: 0x808080,
            clicked: config.tinting?.hover ?? 0x808080,
        })
        : {
            hover: 0x808080,
            clicked: 0x808080,
        };

        let button = this.addModule(new UIElement({
            tinting: tinting,
            onStateChange: (state) => {
                if (config.onStateChange) config.onStateChange.apply(this, tmp.argArray(state));
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

        let button = this.getModule(UIElement);
        if (button) {
            button.setDisabled(!this.enabled);
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
