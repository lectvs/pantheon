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

    update() {
        super.update();
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

namespace MenuNumericSelector {
    export type Config = SpriteText.Config & {
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

    update() {
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

namespace MenuControlMapper {
    export type Config = SpriteText.Config & {
        controlName: string;
    }
}

class MenuControlMapper extends SpriteText {
    controlName: string;
    selectedBinding: string;

    constructor(config: MenuControlMapper.Config) {
        super(config);
        this.controlName = config.controlName;
        this.selectedBinding = undefined;

        this.setBindings();
    }

    update() {
        super.update();

        if (this.selectedBinding && Input.justDown(Input.GAME_CLOSE_MENU)) {
            Input.consume(Input.GAME_CLOSE_MENU);
            this.unselectBinding();
        }

        if (this.selectedBinding) {
            let pressedKey = Input.getEventKey();
            if (pressedKey) {
                let controls = Options.getOption<Input.KeyCodesByName>(Options.CONTROLS);
                let pressedKeyAlreadyBound = _.contains(controls[this.controlName], pressedKey);
                let pressedKeyIsSelect = _.contains(controls[Input.GAME_SELECT], pressedKey);
                if (pressedKeyAlreadyBound) {
                    Input.consumeEventKey();
                } else if (pressedKeyIsSelect && this.children.some((button: MenuTextButton) => button.isHovered())) {
                    // No-op, will fall through and select the other key
                } else {
                    Input.updateControlBinding(this.controlName, this.selectedBinding, pressedKey);
                    this.setBindings();
                }
            }
        }
    }

    private setBindings() {
        World.Actions.removeWorldObjectsFromWorld(this.children);

        let controls = <Input.KeyCodesByName>Options.getOption(Options.CONTROLS);
        let controlBindings = controls[this.controlName];

        let bindingx = 0;
        let text = "";
        for (let binding of controlBindings) {
            let bindingId = binding;
            let bindingName = this.getBindingName(binding);

            let bindingButton = this.addChild(new MenuTextButton({
                name: this.getBindingMappingObjectName(binding),
                font: this.fontKey,
                text: bindingName,
                onClick: () => {
                    global.game.playSound('click');
                    this.selectBinding(bindingId);
                }
            }));
            bindingButton.localx = bindingx;
            bindingButton.style = this.style;

            bindingx += (bindingName.length + 3) * this.font.charWidth;
            text += " ".repeat(bindingName.length) + " / ";
        }

        this.setText(text.substr(0, text.length-3));
        this.selectedBinding = undefined;
    }

    private selectBinding(binding: string) {
        if (this.selectedBinding) this.unselectBinding();
        this.selectedBinding = binding;
        let bindingObject = this.getChildByName<MenuTextButton>(this.getBindingMappingObjectName(binding));
        bindingObject.style.color = 0xFFFF00;
        Input.consumeEventKey();
    }

    private unselectBinding() {
        let bindingObject = this.getChildByName<MenuTextButton>(this.getBindingMappingObjectName(this.selectedBinding));
        bindingObject.style.color = this.style.color;
        this.selectedBinding = undefined;
    }

    private getBindingName(binding: string) {
        if (_.isEmpty(binding)) return 'Empty';
        if (binding === ' ') return 'Space';
        if (binding.length === 1) return binding.toUpperCase();
        return binding;
    }

    private getBindingMappingObjectName(binding: string) {
        return `binding::${this.controlName}::${binding}`;
    }
}