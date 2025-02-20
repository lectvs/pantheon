class ThreeQuartersShadow extends Sprite {
    constructor(width: number, layer: string, alpha: number = 0.33) {
        super({
            texture: Textures.filledCircle(50, 0x000000),
            layer,
            scaleX: width/100,
            scaleY: width/150,
            alpha,
        });
    }

    override postUpdate(): void {
        super.postUpdate();
        this.z = 0;
    }
}