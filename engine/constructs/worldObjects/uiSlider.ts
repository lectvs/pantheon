namespace UISlider {
    export type Config = WorldObject.Config<UISlider> & {
        barTexture: string | PIXI.Texture;
        barLength: number;
        barConfig?: Sprite.Config<Sprite>;
        sliderTexture: string | PIXI.Texture;
        sliderConfig?: Sprite.Config<Sprite>;
        minValue: number;
        maxValue: number;
        keyboardGranularity: number;
        getValue: Getter<number>;
        setValue: Setter<number>;
        tinting: UIElement.Tinting;
    }
}

class UISlider extends WorldObject {
    barLength: number;
    minValue: number;
    maxValue: number;
    keyboardGranularity: number;
    private getValue: Getter<number>;
    private setValue: Setter<number>;

    baseTint: number;
    hoverTint: number;
    clickedTint: number;

    bar: Sprite;
    slider: Sprite;

    private bounds: Bounds;
    private grabbing: boolean = false;
    private lastHovered: boolean = false;

    constructor(config: UISlider.Config) {
        super({
            ...config,
        });

        this.barLength = config.barLength;
        this.minValue = config.minValue;
        this.maxValue = config.maxValue;
        this.keyboardGranularity = config.keyboardGranularity;
        this.getValue = config.getValue;
        this.setValue = config.setValue;

        this.baseTint = config.tinting.base ?? 0xFFFFFF;
        this.hoverTint = config.tinting.hover ?? 0xBBBBBB;
        this.clickedTint = config.tinting.clicked ?? 0x808080;

        this.bounds = new RectBounds(-this.barLength/2 - 4, -6, this.barLength + 8, 12, this);

        this.bar = this.addChild(new Sprite({
            texture: config.barTexture,
            ...(config.barConfig ?? {}),
        }));

        this.slider = this.addChild(new Sprite({
            x: this.valueToWorldX(this.getValue()) - this.x,
            texture: config.sliderTexture,
            ...(config.sliderConfig ?? {}),
        }));

        this.addModule(new UIElement({
            onKeyboardLeft: () => {
                this.set(this.get() - this.keyboardGranularity);
            },
            onKeyboardRight: () => {
                this.set(this.get() + this.keyboardGranularity);
            },
            onStateChange: (state, lastState) => {
                this.bar.tint = this.baseTint;
                this.slider.tint = this.baseTint;

                if (state.hovered || state.selected) {
                    this.bar.tint = this.hoverTint;
                    this.slider.tint = this.hoverTint;
                }

                if (state.clickedDown) {
                    this.bar.tint = this.clickedTint;
                    this.slider.tint = this.clickedTint;
                }
            },
        }));
    }

    override update(): void {
        super.update();

        let mousePos = this.worldd.getWorldMouseBounds$();
        let hovered = this.bounds.containsPoint(mousePos);

        if (hovered && Input.justDown('click')) {
            global.game.playSound('click');
            this.grabbing = true;
        }

        if (Input.isUp('click')) {
            if (this.grabbing) global.game.playSound('click');
            this.grabbing = false;
        }

        if (this.grabbing) {
            // this.bar.tint = this.clickedTint;
            // this.slider.tint = this.clickedTint;
            this.slider.x = M.clamp(mousePos.x, this.x - this.barLength/2, this.x + this.barLength/2);
            this.setValue(this.worldXToValue(this.slider.x));
        } else if (hovered) {
            // this.bar.tint = this.hoverTint;
            // this.slider.tint = this.hoverTint;
            if (!this.lastHovered) {
                // juiceObject(this, 0.5);
                // juiceObject(this.slider, 3);
            }
        } else {
            // this.bar.tint = this.baseTint;
            // this.slider.tint = this.baseTint;
        }

        this.lastHovered = hovered;
    }

    get() {
        return this.worldXToValue(this.slider.x);
    }

    set(value: number) {
        value = M.clamp(value, this.minValue, this.maxValue);
        this.setValue(value);
        this.slider.x = this.valueToWorldX(value);
    }

    private worldXToValue(x: number) {
        return M.map(x, this.x - this.barLength/2, this.x + this.barLength/2, this.minValue, this.maxValue);
    }

    private valueToWorldX(value: number) {
        return M.map(value, this.minValue, this.maxValue, this.x - this.barLength/2, this.x + this.barLength/2);
    }
}